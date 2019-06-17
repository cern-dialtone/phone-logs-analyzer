export function getType(txt) {
  /**
   * Find the type of event
   * 
   * @param {object} txt - event object 
   */
    if (!txt || !txt[0])
      return;
    let data = null;
    if (txt[0].indexOf('APP:') > -1)
      data = txt[0].split('%c')[1];
    else if (txt[0].indexOf('|') > -1)
      data = txt[0].split('|')[1];
    else if (txt[0].indexOf('hashed token:') > -1)
      data = txt[0].split(':')[0];
    else if (txt[0].indexOf('Warning:') > -1)
      data = 'Warning';
    else if (txt[0].indexOf(':') > -1)
      data = txt[0].substr(0, txt[0].lastIndexOf(':'));
    else if (typeof txt[0] == "string")
      data = txt[0];
    return data;
  }
  export function getInfos(txt) {
    /**
     * 
     * @param {object} txt - event object
     */
    if (!txt || !txt[0])
      return;
    let data = null;
      if (txt[0].indexOf('|') > -1)
      data = txt[0].split('|')[2];
    else if (txt[0].indexOf('APP:') > -1)
      data = txt[0].split('%c')[2];
    else if (txt[0].indexOf('hashed token:') > -1)
      data = txt[0].split(':')[1];
    else if (txt[0].indexOf('Warning:') > -1)
      data = txt[0].substr(txt[0].indexOf(':')+1, txt[0].indexOf(':').length);
    else if (txt[0].indexOf(':') > -1)
      data = txt[0].substr(txt[0].lastIndexOf(':')+1, txt[0].lastIndexOf(':').length);
    else if (typeof txt[0] == "string")
      data = txt[0];
    return data;
  }
  export function getTime(txt, start) {
    /**
     * Give relative time according to start
     * 
     * @param {object} txt - event object
     * @param {date} start - POSIX format date of first event
     * 
     * @return {string} - ex: +5s
     */
    if (!txt || !txt[0] || !start)
      return;
    let current_time = parseInt(Date.parse(txt[txt.length-1]));
    let start_time = parseInt(Date.parse(start[start.length-1]));
    return "+"+(current_time-start_time)/1000+"s";
  }
  export function getColor(txt) {
    /**
     * Will get first color if there's one in event object txt and add opacity (too bright to be read otherwise)
     */
    let r, g, b;
    for (let i = 0; txt[i]; i++)
      if (typeof txt[i] == "string" && txt[i].indexOf('color') > -1) {
        let color = txt[i].substr(txt[i].indexOf('#')+1, txt[i].indexOf('#').length);
        r = parseInt("0x"+color.substr(0, 2));
        g = parseInt("0x"+color.substr(3, 2));
        b = parseInt("0x"+color.substr(4, 2));
        color = "rgba("+r+", "+g+", "+b+", 0.3)";
        return color;
      }
    return "transparent";
  }