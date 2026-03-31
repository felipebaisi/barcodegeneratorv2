#!/usr/bin/env bash
# =============================================================================
# billing-guard/setup.sh
#
# Sets up a $10 hard billing cap for the barcode-generator GCP project.
# When spend hits $10, a Cloud Function automatically disables billing,
# taking the Cloud Run service offline to prevent further charges.
#
# Usage:
#   chmod +x billing-guard/setup.sh
#   ./billing-guard/setup.sh
# =============================================================================

set -euo pipefail

# --- Configuration -----------------------------------------------------------
PROJECT_ID="barcodegeneratorv2"
BILLING_ACCOUNT_ID="011B51-6883ED-C9587F"
REGION="us-east1"
BUDGET_AMOUNT="10"

echo ""
echo "========================================"
echo "  Billing Guard Setup — Barcode Generator"
echo "========================================"
echo ""
echo "--- Summary ---"
echo "  Project ID:         $PROJECT_ID"
echo "  Billing Account:    $BILLING_ACCOUNT_ID"
echo "  Region:             $REGION"
echo "  Budget hard cap:    \$$BUDGET_AMOUNT/month"
echo ""
read -rp "Proceed with setup? [y/N]: " CONFIRM
if [[ ! "$CONFIRM" =~ ^[yY]$ ]]; then
  echo "Aborted."
  exit 0
fi

TOPIC_NAME="billing-budget-alerts"
FUNCTION_NAME="billing-guard"
BUDGET_NAME="barcode-generator-budget"
# -----------------------------------------------------------------------------

echo "==> Using project: $PROJECT_ID"
gcloud config set project "$PROJECT_ID"

echo "==> Enabling required APIs..."
gcloud services enable \
  cloudfunctions.googleapis.com \
  cloudbilling.googleapis.com \
  pubsub.googleapis.com \
  billingbudgets.googleapis.com \
  cloudbuild.googleapis.com \
  --project="$PROJECT_ID"

echo "==> Creating Pub/Sub topic: $TOPIC_NAME"
gcloud pubsub topics create "$TOPIC_NAME" \
  --project="$PROJECT_ID" \
  2>/dev/null || echo "    Topic already exists — skipping."

echo "==> Deploying Cloud Function: $FUNCTION_NAME"
gcloud functions deploy "$FUNCTION_NAME" \
  --gen2 \
  --runtime=nodejs18 \
  --region="$REGION" \
  --source="./billing-guard" \
  --entry-point=stopBilling \
  --trigger-topic="$TOPIC_NAME" \
  --project="$PROJECT_ID" \
  --set-env-vars="GCP_PROJECT=$PROJECT_ID" \
  --memory=128Mi \
  --timeout=60s

# Get the Cloud Function's service account
FUNCTION_SA=$(gcloud functions describe "$FUNCTION_NAME" \
  --region="$REGION" \
  --project="$PROJECT_ID" \
  --format="value(serviceConfig.serviceAccountEmail)")

echo "==> Cloud Function service account: $FUNCTION_SA"

echo "==> Granting billing.projectManager role to the function's service account..."
echo "    (This allows the function to unlink billing from the project)"
gcloud billing accounts add-iam-policy-binding "$BILLING_ACCOUNT_ID" \
  --member="serviceAccount:$FUNCTION_SA" \
  --role="roles/billing.projectManager"

# Get the Pub/Sub topic full resource name
TOPIC_RESOURCE="projects/$PROJECT_ID/topics/$TOPIC_NAME"

echo "==> Creating billing budget: $BUDGET_NAME (limit: \$$BUDGET_AMOUNT)"
gcloud billing budgets create \
  --billing-account="$BILLING_ACCOUNT_ID" \
  --display-name="$BUDGET_NAME" \
  --projects="projects/$PROJECT_ID" \
  --budget-amount="${BUDGET_AMOUNT}USD" \
  --threshold-rule=percent=0.5,basis=CURRENT_SPEND \
  --threshold-rule=percent=0.9,basis=CURRENT_SPEND \
  --threshold-rule=percent=1.0,basis=CURRENT_SPEND \
  --notifications-rule-pubsub-topic="$TOPIC_RESOURCE" \
  --notifications-rule-disable-default-iam-recipients

echo ""
echo "✅ Billing guard is active!"
echo ""
echo "   Budget:    \$$BUDGET_AMOUNT/month"
echo "   Alerts:    50%, 90%, 100% of budget"
echo "   Hard cap:  Billing auto-disabled when spend exceeds \$$BUDGET_AMOUNT"
echo "   Effect:    Cloud Run service goes offline if billing is disabled"
echo ""
echo "   To re-enable billing (if triggered):"
echo "   gcloud billing projects link $PROJECT_ID --billing-account=$BILLING_ACCOUNT_ID"
