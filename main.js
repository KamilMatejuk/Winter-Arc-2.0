function updateNumericValue(key, parsedValue) {
    document.getElementById(`${key}_range`).innerText = parsedValue;
    if (parsedValue == '0.0h' || parsedValue == '0m') parsedValue = '---';
    document.getElementById(`${key}_value`).innerText = parsedValue;
}

function updateBooleanValue(key, value) {
    const check = document.getElementById(`${key}_value_true`)
    const cross = document.getElementById(`${key}_value_false`)
    if (value) {
        check.style.display = 'inline';
        cross.style.display = 'none';
    } else {
        check.style.display = 'none';
        cross.style.display = 'inline';
    }
}

function updateMinutesValue(key, value) {
    const h = Math.floor(value / 60);
    const m = (value % 60).toString().padStart(2, '0');
    if (h == 0) return updateNumericValue(key, `${m}m`);
    return updateNumericValue(key, `${h}h ${m}m`);
}

function updateHoursValue(key, value) {
    return updateNumericValue(key, `${parseFloat(value).toFixed(1)}h`);
}

function updateWeightValue(value) {
    return updateNumericValue('weight', `${parseFloat(value).toFixed(1)}kg`);
}

function updateProteinValue(value) {
    return updateNumericValue('protein', `${value}g`);
}

function rangeChange(button, increase) {
    const range = button.parentElement.querySelector('input[type="range"]');
    const step = parseFloat(range.step) || 1;
    const max = parseFloat(range.max);
    const min = parseFloat(range.min);
    let value = parseFloat(range.value) || 0;
    value += increase ? step : -step;
    if (value > max) value = max;
    if (value < min) value = min;
    range.value = value;
    range.oninput();
}

function download() {
    const banner = document.getElementById('banner');
    html2canvas(banner).then(canvas => {
        const link = document.createElement('a');
        link.download = 'daily_banner.png';
        link.href = canvas.toDataURL();
        link.click();
    });
}
