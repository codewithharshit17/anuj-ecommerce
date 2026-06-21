$processes = Get-Process -Name node -ErrorAction SilentlyContinue
foreach ($p in $processes) {
    try {
        $modules = $p.Modules
        $locking = $modules | Where-Object { $_.FileName -like "*query_engine*" }
        if ($locking) {
            Write-Output "FOUND LOCKING PROCESS:"
            Write-Output "ID: $($p.Id)"
            Write-Output "Path: $($p.Path)"
            Write-Output "Module: $($locking.FileName)"
            # Let's kill it
            Stop-Process -Id $p.Id -Force
            Write-Output "KILLED process $($p.Id)"
        }
    } catch {
        # ignore access denied
    }
}
