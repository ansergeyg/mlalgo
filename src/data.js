// Data parsing and training helper UI

/** Convert inputs to numbers or NaN for invalid/empty strings. */
export function toNumber(value) {
  const numeric = typeof value === 'string' && value.trim() === '' ? Number.NaN : Number(value);
  if (Number.isFinite(numeric)) return numeric;
  return Number.NaN;
}

/** Try keys in order and return the first finite numeric value. */
export function extractNumber(obj, keys) {
  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const numeric = toNumber(obj[key]);
      if (Number.isFinite(numeric)) return numeric;
    }
  }
  return undefined;
}

/** Normalize various boolean-like inputs into 0/1 labels. */
export function parseBinaryLabel(value, description) {
  if (typeof value === 'boolean') return value ? 1 : 0;
  if (typeof value === 'number') {
    if (value === 0 || value === 1) return value;
  }
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (['1', 'yes', 'y', 'true', 'ready', 'special'].includes(normalized)) return 1;
    if (['0', 'no', 'n', 'false', 'ordinary'].includes(normalized)) return 0;
  }
  throw new Error(`${description} should be either 0/1, yes/no, or true/false.`);
}

/** Parse linear-regression rows: [{hours, score}] */
export function parseLinearDataset(raw) {
  if (!Array.isArray(raw)) {
    throw new Error('Please provide a JSON array of tasting sessions.');
  }
  if (raw.length < 2) {
    throw new Error('Add at least two sessions so the line can be estimated.');
  }
  return raw.map((entry, index) => {
    if (entry == null || typeof entry !== 'object') {
      throw new Error(`Entry ${index + 1} must be an object with "hours" and "score".`);
    }
    const hours = extractNumber(entry, ['hours', 'Hours']);
    const score = extractNumber(entry, ['score', 'Score']);
    if (hours === undefined || !Number.isFinite(hours)) {
      throw new Error(`Entry ${index + 1} needs a numeric "hours" value.`);
    }
    if (score === undefined || !Number.isFinite(score)) {
      throw new Error(`Entry ${index + 1} needs a numeric "score" value.`);
    }
    return { hours, score };
  });
}

/** Parse logistic-regression rows with either features or named fields. */
export function parseLogisticDataset(raw) {
  if (!Array.isArray(raw)) {
    throw new Error('Provide a JSON array where each item represents an apple.');
  }
  if (raw.length === 0) {
    throw new Error('Add at least one apple example to train the classifier.');
  }
  return raw.map((entry, index) => {
    if (entry == null || typeof entry !== 'object') {
      throw new Error(`Entry ${index + 1} must be an object with tasting clues.`);
    }
    let features;
    if (Array.isArray(entry.features) && entry.features.length >= 2) {
      const first = toNumber(entry.features[0]);
      const second = toNumber(entry.features[1]);
      if (Number.isFinite(first) && Number.isFinite(second)) features = [first, second];
    }
    if (!features) {
      const crunchiness = extractNumber(entry, ['crunchiness', 'Crunchiness']);
      const colorDepth = extractNumber(entry, ['color', 'Color', 'colorDepth', 'Color depth']);
      if (Number.isFinite(crunchiness) && Number.isFinite(colorDepth)) features = [crunchiness, colorDepth];
    }
    if (!features) {
      throw new Error(`Entry ${index + 1} needs either a "features" array or numeric "crunchiness" and "color depth" values.`);
    }
    const labelSource = entry.label ?? entry.ready ?? entry['Ready'] ?? entry['Ready for market?'];
    if (labelSource === undefined) {
      throw new Error(`Entry ${index + 1} needs a yes/no outcome ("label" or "ready").`);
    }
    const label = parseBinaryLabel(labelSource, `Entry ${index + 1} outcome`);
    return { features, label };
  });
}

/** Parse XOR-like dataset rows for neural-net demo. */
export function parseNeuralDataset(raw) {
  if (!Array.isArray(raw)) {
    throw new Error('Provide a JSON array describing the surprising flavor pairs.');
  }
  if (raw.length === 0) {
    throw new Error('Add at least one flavor pair so the network has something to learn.');
  }
  return raw.map((entry, index) => {
    if (entry == null || typeof entry !== 'object') {
      throw new Error(`Entry ${index + 1} must be an object with "features" or taste fields.`);
    }
    let features;
    if (Array.isArray(entry.features) && entry.features.length >= 2) {
      const first = toNumber(entry.features[0]);
      const second = toNumber(entry.features[1]);
      if (Number.isFinite(first) && Number.isFinite(second)) features = [first, second];
    }
    if (!features) {
      const flavor = extractNumber(entry, ['flavor', 'Flavor', 'flavorSurprise', 'Flavor surprise']);
      const texture = extractNumber(entry, ['texture', 'Texture', 'textureSurprise', 'Texture surprise']);
      if (Number.isFinite(flavor) && Number.isFinite(texture)) features = [flavor, texture];
    }
    if (!features) {
      throw new Error(`Entry ${index + 1} needs a "features" array or flavor & texture numbers.`);
    }
    const labelSource = entry.label ?? entry.special ?? entry['Special'] ?? entry['Special batch?'];
    if (labelSource === undefined) {
      throw new Error(`Entry ${index + 1} needs a yes/no label ("label" or "special").`);
    }
    const label = parseBinaryLabel(labelSource, `Entry ${index + 1} label`);
    return { features, label };
  });
}

/** Build a small UI to paste JSON and trigger re-training. */
export function createJsonTrainer({ title, sample, onTrain }) {
  const wrapper = document.createElement('div');
  wrapper.style.marginTop = '24px';
  wrapper.style.padding = '16px';
  wrapper.style.border = '1px solid #cbd5f5';
  wrapper.style.background = '#f8f9ff';
  wrapper.style.borderRadius = '12px';

  const heading = document.createElement('h3');
  heading.textContent = title;
  heading.style.marginTop = '0';
  heading.style.marginBottom = '8px';
  heading.style.fontSize = '1.05rem';
  heading.style.color = '#4338ca';
  wrapper.appendChild(heading);

  const description = document.createElement('p');
  description.textContent = 'Paste a JSON array of examples and press “Train on this data” to rerun the model on your own notes. All values should be numbers so the algorithms can learn properly.';
  description.style.marginTop = '0';
  description.style.fontSize = '0.9rem';
  description.style.color = '#334155';
  wrapper.appendChild(description);

  const textarea = document.createElement('textarea');
  textarea.value = JSON.stringify(sample, null, 2);
  textarea.style.width = '100%';
  textarea.style.minHeight = '160px';
  textarea.style.fontFamily = '"Fira Code", Consolas, monospace';
  textarea.style.fontSize = '0.85rem';
  textarea.style.padding = '12px';
  textarea.style.border = '1px solid #c7d2fe';
  textarea.style.borderRadius = '8px';
  textarea.style.boxSizing = 'border-box';
  textarea.style.background = '#ffffff';
  wrapper.appendChild(textarea);

  const controls = document.createElement('div');
  controls.style.display = 'flex';
  controls.style.alignItems = 'center';
  controls.style.gap = '12px';
  controls.style.marginTop = '12px';
  wrapper.appendChild(controls);

  const button = document.createElement('button');
  button.textContent = 'Train on this data';
  button.style.padding = '10px 18px';
  button.style.border = 'none';
  button.style.borderRadius = '999px';
  button.style.background = 'linear-gradient(90deg, #4c1d95, #2563eb)';
  button.style.color = '#ffffff';
  button.style.fontWeight = '600';
  button.style.cursor = 'pointer';
  button.style.boxShadow = '0 8px 16px rgba(79, 70, 229, 0.25)';
  controls.appendChild(button);

  const status = document.createElement('span');
  status.style.fontSize = '0.85rem';
  status.style.fontWeight = '500';
  controls.appendChild(status);

  const setStatus = (message, isError = false) => {
    status.textContent = message;
    status.style.color = isError ? '#dc2626' : '#047857';
  };

  button.addEventListener('click', () => {
    try {
      const parsed = JSON.parse(textarea.value);
      const message = onTrain(parsed);
      if (typeof message === 'string' && message.trim().length > 0) {
        setStatus(message);
      } else {
        setStatus('Model updated successfully!');
      }
    } catch (error) {
      setStatus(error.message ?? 'Something went wrong while parsing the data.', true);
    }
  });

  return { wrapper, setStatus, textarea };
}
