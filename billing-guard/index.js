const { GoogleAuth } = require('google-auth-library');

/**
 * Cloud Function triggered by a Pub/Sub budget notification.
 * Disables billing on the project when spend exceeds the budget amount.
 */
exports.stopBilling = async (pubSubEvent, context) => {
  let pubSubData;
  try {
    pubSubData = JSON.parse(Buffer.from(pubSubEvent.data, 'base64').toString());
  } catch (err) {
    console.error('Failed to parse Pub/Sub message:', err);
    return;
  }

  const costAmount = pubSubData.costAmount ?? 0;
  const budgetAmount = pubSubData.budgetAmount ?? 0;

  console.log(`Current spend: $${costAmount} / Budget: $${budgetAmount}`);

  if (costAmount <= budgetAmount) {
    console.log('Spend is within budget — no action taken.');
    return;
  }

  const projectId = process.env.GCP_PROJECT || process.env.GCLOUD_PROJECT;
  if (!projectId) {
    console.error('GCP_PROJECT environment variable not set.');
    return;
  }

  console.warn(`Spend $${costAmount} exceeds budget $${budgetAmount}. Disabling billing for project: ${projectId}`);
  await disableBillingForProject(projectId);
};

async function disableBillingForProject(projectId) {
  const auth = new GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/cloud-billing'],
  });
  const client = await auth.getClient();
  const { token } = await client.getAccessToken();

  const url = `https://cloudbilling.googleapis.com/v1/projects/${projectId}/billingInfo`;
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    // Setting billingAccountName to empty string unlinks the billing account
    body: JSON.stringify({ billingAccountName: '' }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Failed to disable billing (HTTP ${response.status}): ${body}`);
  }

  console.log(`Billing successfully disabled for project ${projectId}. The Cloud Run service is now offline.`);
}
