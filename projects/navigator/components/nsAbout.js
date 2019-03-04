/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");
Components.utils.import("resource://gre/modules/Services.jsm");

const SCRIPT = Components.interfaces.nsIAboutModule.ALLOW_SCRIPT;
const UNTRUSTED = Components.interfaces.nsIAboutModule.URI_SAFE_FOR_UNTRUSTED_CONTENT;
const HIDE = Components.interfaces.nsIAboutModule.HIDE_FROM_ABOUTABOUT;
const INDEXEDDB = Components.interfaces.nsIAboutModule.ENABLE_INDEXED_DB;

function About() { }
About.prototype = {
  blockedURI: "chrome://communicator/content/blockedSite.xhtml",
  blockedFlags: SCRIPT | UNTRUSTED | HIDE,
  certerrorURI: "chrome://communicator/content/certError.xhtml",
  certerrorFlags: SCRIPT | UNTRUSTED | HIDE,
  dataURI: "chrome://communicator/content/dataman/dataman.xul",
  dataFlags: SCRIPT,
  feedsURI: "chrome://communicator/content/feeds/subscribe.xhtml",
  feedsFlags: SCRIPT | UNTRUSTED | HIDE,
  privatebrowsingURI: "chrome://communicator/content/aboutPrivateBrowsing.xul",
  privatebrowsingFlags: SCRIPT,
  rightsURI: "chrome://branding/content/aboutRights.xhtml",
  rightsFlags: SCRIPT | UNTRUSTED,
  sessionrestoreURI: "chrome://communicator/content/aboutSessionRestore.xhtml",
  sessionrestoreFlags: SCRIPT | HIDE,
  steamedhamsURI: "chrome://navigator/content/aboutSH.xhtml",
  steamedhamsFlags: SCRIPT | HIDE,
  logopageURI: "chrome://global/content/logopage.xhtml",
  logopageFlags: UNTRUSTED | HIDE,

  classID: Components.ID("{d54f2c89-8fd6-4eeb-a7a4-51d4dcdf460f}"),
  QueryInterface: XPCOMUtils.generateQI([Components.interfaces.nsIAboutModule]),

  getModule: function(aURI) {
    return aURI.path.replace(/-|\W.*$/g, "").toLowerCase();
  },

  getURIFlags: function(aURI) {
    return this[this.getModule(aURI) + "Flags"];
  },

  newChannel: function(aURI, aLoadInfo) {
    var module = this.getModule(aURI);
    var newURI = Services.io.newURI(this[module + "URI"], null, null);
    var channel = aLoadInfo ?
                  Services.io.newChannelFromURIWithLoadInfo(newURI, aLoadInfo) :
                  Services.io.newChannelFromURI2(newURI, null,
                                                 Services.scriptSecurityManager.getSystemPrincipal(),
                                                 null,
                                                 Components.interfaces.nsILoadInfo.SEC_NORMAL,
                                                 Components.interfaces.nsIContentPolicy.TYPE_OTHER);
    channel.originalURI = aURI;
    if (this[module + "Flags"] & UNTRUSTED)
      channel.owner = null;
    return channel;
  },

  getIndexedDBOriginPostfix: function(aURI) {
    if (this.getURIFlags(aURI) & INDEXEDDB) {
      return this[this.getModule(aURI) + "Postfix"] || null;
    }
    throw Components.results.NS_ERROR_ILLEGAL_VALUE;
  }
};

var NSGetFactory = XPCOMUtils.generateNSGetFactory([About]);
