# Test rotation
$body = @{
    type = "qrcode"
    text = "TEST ROTATION"
    format = "png"
    options = @{
        scale = 8
        rotation = 90
    }
} | ConvertTo-Json

Write-Host "Testing rotation = 90"
Invoke-WebRequest -Uri "http://localhost:8080/generate" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body `
    -UseBasicParsing `
    -OutFile "test-rotation-90.png"

Write-Host "Saved to test-rotation-90.png"

# Compare with no rotation
$body2 = @{
    type = "qrcode"
    text = "TEST ROTATION"
    format = "png"
    options = @{
        scale = 8
        rotation = 0
    }
} | ConvertTo-Json

Write-Host "Testing rotation = 0"
Invoke-WebRequest -Uri "http://localhost:8080/generate" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body2 `
    -UseBasicParsing `
    -OutFile "test-rotation-0.png"

Write-Host "Saved to test-rotation-0.png"
Write-Host ""
Write-Host "File sizes:"
Get-Item test-rotation-*.png | Select-Object Name, Length
