const parseBoolEnv = (val) => {
  return ['true', 'yes', 'y', '1'].includes(val.toLowerCase().trim());
};

const makeNullsafe = (f) => {
  return (x) => (x === undefined) ? undefined : f(x);
};

const nullsafeParseInt = makeNullsafe(parseInt);
const nullsafeParseBoolEnv = makeNullsafe(parseBoolEnv);

const _removeUndefined = (o) => {
  let hasKeys = false;
  for (const key of Object.keys(o)) {
    let v = o[key];
    if (typeof v === 'object' && v != null) {
      o[key] = v = _removeUndefined(v);
    }
    if (v === undefined || v === null) {
      delete o[key];
    } else {
      hasKeys = true;
    }
  }
  return hasKeys ? o : undefined;
};

const removeUndefined = (o) => {
  const cleaned = _removeUndefined(o);
  return cleaned ?? ({});
};

module.exports = {
  parseBoolEnv,
  makeNullsafe,
  nullsafeParseInt,
  nullsafeParseBoolEnv,
  removeUndefined,
};