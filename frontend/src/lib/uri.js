const URI_REGEXP = /^(?:([^:/\\?#]+):)?(?:[/\\]{2}([^/\\?#]*))?([^?#]*)(?:\?([^#]*))?(?:[#](.*))?$/;

export default class URI {
  constructor({ scheme, authority, path, query, fragment } = {}) {
    this._query = new QueryComponent();
    this.authority = authority;
    this.path = path;
    this.fragment = fragment;
    this.setScheme(scheme);
    this.setQuery(query);
  }

  getScheme() {
    return this.scheme || '';
  }

  setScheme(scheme) {
    this.scheme = scheme;
    return this;
  }

  getAuthority() {
    return this.authority || '';
  }

  setAuthority(authority) {
    this.authority = authority;
    return this;
  }

  getPath() {
    return this.path || '';
  }

  setPath(path) {
    this.path = path;
    return this;
  }

  getFragment() {
    return this.fragment || '';
  }

  setFragment(fragment) {
    this.fragment = fragment;
    return this;
  }

  getQuery() {
    return this._query.dict;
  }

  setQuery(query) {
    this._query = new QueryComponent(query || {});
    return this;
  }

  updateQuery(param, value = null) {
    this._query.add(param, value);
    return this;
  }

  removeQuery(param) {
    this._query.remove(param);
    return this;
  }

  clone() {
    return new URI(this.toObject());
  }

  toObject() {
    return {
      scheme: this.getScheme(),
      authority: this.getAuthority(),
      path: this.getPath(),
      query: this.getQuery(),
      fragment: this.getFragment(),
    };
  }

  toString() {
    let result = '';
    if (this.scheme) {
      result += this.scheme + ':';
    }
    if (this.authority) {
      result += '//' + URI.encode(this.authority, ':@[]');
    }
    if (this.path) {
      result += URI.encode(this.path, '/');
    }
    const queryString = this._query.toString();
    if (queryString) {
      result += '?' + queryString;
    }
    if (this.fragment) {
      result += '#' + URI.encode(this.fragment, ':@[]/&=+?#!');
    }
    return result;
  }
}

URI.parse = uriString => {
  const matches = String(uriString).match(URI_REGEXP) || [];
  const [, scheme, authority, path, queryString, fragment] = matches;
  return new URI()
    .setScheme(scheme)
    .setAuthority(URI.decode(authority))
    .setPath(URI.decode(path))
    .setQuery(QueryComponent.parseString(queryString))
    .setFragment(URI.decode(fragment));
};

URI.encode = (value, safe = '') => {
  if (!value) {
    return '';
  }
  safe += '~';

  value = encodeURIComponent(value);
  for (let i = 0; i < safe.length; i++) {
    const safeChar = safe[i];
    const escaped = encodeURIComponent(safeChar);
    value = value.replace(new RegExp(escaped, 'g'), safeChar);
  }

  return value;
};

URI.decode = value => {
  if (!value) {
    return '';
  }
  return decodeURIComponent(value);
};

class QueryComponent {
  constructor(params) {
    this.dict = {};
    this.add(params);
  }

  _addKeyValue(key, value) {
    if (value === null) {
      // we ignore null values
      return this;
    }

    if (Array.isArray(value)) {
      this.dict[key] = value.map(x => String(x));
    } else {
      this.dict[key] = String(value);
    }

    return this;
  }

  add(param = {}, value = null) {
    if (typeof param === 'string') {
      // adding a single key/value pair
      this._addKeyValue(param, value);
    } else {
      // adding a set of key => value query params
      Object.keys(param).forEach(key => {
        const value = param[key];
        this._addKeyValue(key, value);
      });
    }

    return this;
  }

  remove(key) {
    return delete this.dict[key];
  }

  replace(query) {
    this.dict = query || {};
    return this;
  }

  toString() {
    let result = [];
    Object.keys(this.dict).forEach(k => {
      const v = this.dict[k];
      if (Array.isArray(v)) {
        v.forEach(x => result.push(QueryComponent.encode(k) + '=' + QueryComponent.encode(x)));
      } else {
        result.push(QueryComponent.encode(k) + '=' + QueryComponent.encode(v));
      }
    });
    if (!result.length) {
      return '';
    }
    return result.join('&');
  }
}

QueryComponent.parseString = queryString => {
  if (!queryString) {
    return null;
  }
  let paramDict = {};
  const params = queryString.split('&');
  params.forEach(param => {
    if (param !== '') {
      const parts = param.split('=');
      const k = QueryComponent.decode(parts[0]);
      const v = QueryComponent.decode(parts.slice(1).join('='));

      if (k in paramDict) {
        if (!Array.isArray(paramDict[k])) {
          paramDict[k] = [paramDict[k]];
        }
        paramDict[k].push(v);
      } else {
        paramDict[k] = v;
      }
    }
  });
  return paramDict;
};

QueryComponent.decode = value => {
  if (value === null) {
    return '';
  }
  return URI.decode(value.replace(/\+/g, '%20'));
};

QueryComponent.encode = value => {
  if (value === null) {
    return '';
  }
  return URI.encode(value).replace(/%20/g, '+');
};
