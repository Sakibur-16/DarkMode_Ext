Add-Type -AssemblyName System.Drawing

$sizes = @(16, 48, 128)

foreach ($sz in $sizes) {
    $bmp = New-Object System.Drawing.Bitmap($sz, $sz)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.Clear([System.Drawing.Color]::Transparent)

    # Background Gradient
    $p1 = New-Object System.Drawing.Point(0, 0)
    $p2 = New-Object System.Drawing.Point($sz, $sz)
    $c1 = [System.Drawing.Color]::FromArgb(255, 59, 130, 246)
    $c2 = [System.Drawing.Color]::FromArgb(255, 18, 24, 38)
    $bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($p1, $p2, $c1, $c2)
    $g.FillEllipse($bgBrush, 1, 1, $sz - 2, $sz - 2)

    # Moon Shape
    $moonBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 248, 250, 252))
    $moonX = [int]($sz * 0.25)
    $moonY = [int]($sz * 0.20)
    $moonSize = [int]($sz * 0.50)
    $g.FillEllipse($moonBrush, $moonX, $moonY, $moonSize, $moonSize)

    # Moon Cutout
    $cutBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 18, 24, 38))
    $cutX = [int]($sz * 0.38)
    $cutY = [int]($sz * 0.15)
    $cutSize = [int]($sz * 0.48)
    $g.FillEllipse($cutBrush, $cutX, $cutY, $cutSize, $cutSize)

    $outputPath = Join-Path (Get-Location) "icons/icon$sz.png"
    $bmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    Write-Host "Created icon: $outputPath"
}
