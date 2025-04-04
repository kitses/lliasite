# Get all .ttf files in the current directory
$ttfFiles = Get-ChildItem -Path . -Filter *.ttf

# Loop through each .ttf file
foreach ($ttfFile in $ttfFiles) {
    # Execute woff2_compress for the current .ttf file
    woff2_compress $ttfFile.FullName

    # Check if the command was successful
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Successfully compressed $($ttfFile.Name) to .woff2"
    } else {
        Write-Host "Failed to compress $($ttfFile.Name)"
    }
}
