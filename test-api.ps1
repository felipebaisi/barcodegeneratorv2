# Test API with advanced options
$body = @{
    type = "qrcode"
    text = "TEST"
    format = "png"
    options = @{
        scale = 10
        eclevel = "H"
        rotation = 180
        fgColor = "#FF0000"
        bgColor = "#FFFF00"
    }
} | ConvertTo-Json

Write-Host "Request body:"
Write-Host $body

$response = Invoke-WebRequest -Uri "http://localhost:8080/generate" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body `
    -UseBasicParsing `
    -OutFile "test-barcode-red-yellow.png"

Write-Host "Response saved to test-barcode-red-yellow.png"
Write-Host "File size: $((Get-Item test-barcode-red-yellow.png).Length) bytes"
