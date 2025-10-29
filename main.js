// setup

const DEFAULT_RANGES = {
    sleep: { min: 0, max: 10, step: 0.5, value: 5 },
    nap: { min: 0, max: 10, step: 0.5, value: 5 },
    side_projects: { min: 0, max: 8, step: 0.5, value: 4 },
    read: { min: 0, max: 60, step: 5, value: 30 },
    phone: { min: 0, max: 300, step: 1, value: 150 },
    weight: { min: 65, max: 75, step: 0.1, value: 70 },
    kcal: { min: 1500, max: 3500, step: 1, value: 2500 },
    protein: { min: 75, max: 250, step: 1, value: 150 },
}
const DEFAULT_CHECKBOXES = {
    run: false,
    workout: false,
    shoulders: false,
    pushups: false,
    abs: false,
    suppliments: false,
    linkedin_comment: false,
    linkedin_post: false,
    medium: false,
}

function setValues(ranges, checkboxes) {
    for (const key in DEFAULT_RANGES) {
        const range = ranges[key] || DEFAULT_RANGES[key];
        const input = document.getElementById(key);
        input.min = range.min;
        input.max = range.max;
        input.step = range.step;
        input.value = range.value;
        input.oninput()
    }
    for (const key in DEFAULT_CHECKBOXES) {
        const checkbox = checkboxes[key] || DEFAULT_CHECKBOXES[key];
        const input = document.getElementById(key)
        input.checked = checkbox;
        input.oninput()
    }
}

function getFromLocalStorage() {
    const ranges = {};
    const checkboxes = {};
    for (const key in DEFAULT_RANGES) {
        const value = localStorage.getItem(`range_${key}`);
        if (value !== null) ranges[key] = { ...DEFAULT_RANGES[key], value: parseFloat(value) };
    }
    for (const key in DEFAULT_CHECKBOXES) {
        const value = localStorage.getItem(`checkbox_${key}`);
        if (value !== null) checkboxes[key] = (value === 'true');
    }
    return { ranges, checkboxes };
}

function saveToLocalStorage() {
    for (const key in DEFAULT_RANGES) {
        const input = document.getElementById(key);
        localStorage.setItem(`range_${key}`, input.value);
    }
    for (const key in DEFAULT_CHECKBOXES) {
        const input = document.getElementById(key);
        localStorage.setItem(`checkbox_${key}`, input.checked);
    }
}

// working

function updateNumericValue(key, parsedValue) {
    document.getElementById(`${key}_range`).innerText = parsedValue;
    if (parsedValue == '0.0h' || parsedValue == '0m' || parsedValue == '00m') parsedValue = '---';
    document.getElementById(`${key}_value`).innerText = parsedValue;
    saveToLocalStorage();
}

function updateBooleanValue(key) {
    const check = document.getElementById(`${key}_value_true`)
    const cross = document.getElementById(`${key}_value_false`)
    const disabled = document.getElementById(`${key}_disabled`)?.checked;
    const checkbox = document.getElementById(key);
    if (disabled !== undefined) {
        checkbox.parentElement.classList.toggle('disabled', disabled);
        check.parentElement.classList.toggle('disabled', disabled);
    }

    if (disabled) {
        check.style.visibility = 'hidden';
        cross.style.visibility = 'hidden';
        check.style.display = 'inline';
        cross.style.display = 'inline';
    } else if (checkbox.checked) {
        check.style.visibility = 'visible';
        cross.style.visibility = 'hidden';
        check.style.display = 'inline';
        cross.style.display = 'none';
    } else {
        check.style.visibility = 'hidden';
        cross.style.visibility = 'visible';
        check.style.display = 'none';
        cross.style.display = 'inline';
    }
    saveToLocalStorage();
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

function visibilityChange(key, checkbox) {
    const value = checkbox.checked;
    const banner = document.getElementById(`${key}_value`)
    checkbox.parentElement.classList.toggle('disabled', value);
    banner.parentElement.classList.toggle('disabled', value);
    banner.innerText = value ? '---' : document.getElementById(`${key}_range`).innerText;
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

function copyToClipboard() {
    const banner = document.getElementById('banner');
    html2canvas(banner).then(canvas => {
        canvas.toBlob(blob => {
            const item = new ClipboardItem({ 'image/png': blob });
            navigator.clipboard.write([item]);
            Toastify({
                text: "Copied to clipboard!",
                duration: 1000,
                gravity: "bottom",
                position: "center",
                style: { background: "gray" },
            }).showToast();
        });
    });
}

// onload
window.onload = () => {
    const { ranges, checkboxes } = getFromLocalStorage();
    setValues(ranges, checkboxes);
}
