// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// Copyright 2007 Google Inc. All Rights Reserved.

/**
 * @fileoverview Mock of XhrIo for unit testing.
 */

goog.provide('goog.testing.net.XhrIo');

goog.require('goog.array');
goog.require('goog.dom.xml');
goog.require('goog.events');
goog.require('goog.events.EventTarget');
goog.require('goog.json');
goog.require('goog.net.ErrorCode');
goog.require('goog.net.EventType');
goog.require('goog.net.XmlHttp');



/**
 * Mock implementation of goog.net.XhrIo. This doesn't provide a mock
 * implementation for all cases, but it's not too hard to add them as needed.
 * @param {goog.testing.TestQueue=} opt_testQueue Test queue for inserting test
 *     events.
 * @constructor
 * @extends {goog.events.EventTarget}
 */
goog.testing.net.XhrIo = function(opt_testQueue) {
  goog.events.EventTarget.call(this);

  /**
   * Queue of events write to.
   * @type {goog.testing.TestQueue?}
   * @private
   */
  this.testQueue_ = opt_testQueue || null;
};
goog.inherits(goog.testing.net.XhrIo, goog.events.EventTarget);


/**
 * All non-disposed instances of goog.testing.net.XhrIo created
 * by {@link goog.testing.net.XhrIo.send} are in this Array.
 * @see goog.testing.net.XhrIo.cleanupAllPendingStaticSends
 * @type {Array.<goog.testing.net.XhrIo>}
 * @private
 */
goog.testing.net.XhrIo.sendInstances_ = [];


/**
 * Returns an Array containing all non-disposed instances of
 * goog.testing.net.XhrIo created by {@link goog.testing.net.XhrIo.send}.
 * @return {Array} Array of goog.testing.net.XhrIo instances.
 */
goog.testing.net.XhrIo.getSendInstances = function() {
  return goog.testing.net.XhrIo.sendInstances_;
};


/**
 * Simulates the static XhrIo send method.
 * @param {string} url Uri to make request to.
 * @param {Function=} opt_callback Callback function for when request is
 *     complete.
 * @param {string=} opt_method Send method, default: GET.
 * @param {string=} opt_content Post data.
 * @param {Object|goog.structs.Map=} opt_headers Map of headers to add to the
 *     request.
 * @param {number=} opt_timeoutInterval Number of milliseconds after which an
 *     incomplete request will be aborted; 0 means no timeout is set.
 */
goog.testing.net.XhrIo.send = function(url, opt_callback, opt_method,
                                       opt_content, opt_headers,
                                       opt_timeoutInterval) {
  var x = new goog.testing.net.XhrIo();
  goog.testing.net.XhrIo.sendInstances_.push(x);
  if (opt_callback) {
    goog.events.listen(x, goog.net.EventType.COMPLETE, opt_callback);
  }
  goog.events.listen(x,
                     goog.net.EventType.READY,
                     goog.partial(goog.testing.net.XhrIo.cleanupSend_, x));
  if (opt_timeoutInterval) {
    x.setTimeoutInterval(opt_timeoutInterval);
  }
  x.send(url, opt_method, opt_content, opt_headers);
};



/**
 * Disposes of the specified goog.testing.net.XhrIo created by
 * {@link goog.testing.net.XhrIo.send} and removes it from
 * {@link goog.testing.net.XhrIo.pendingStaticSendInstances_}.
 * @param {goog.testing.net.XhrIo} XhrIo An XhrIo created by
 *     {@link goog.testing.net.XhrIo.send}.
 * @private
 */
goog.testing.net.XhrIo.cleanupSend_ = function(XhrIo) {
  XhrIo.dispose();
  goog.array.remove(goog.testing.net.XhrIo.sendInstances_, XhrIo);
};


/**
 * Stores the simulated response headers for the requests which are sent through
 * this XhrIo.
 * @type {Object}
 * @private
 */
goog.testing.net.XhrIo.prototype.responseHeaders_;


/**
 * Whether MockXhrIo is active.
 * @type {boolean}
 * @private
 */
goog.testing.net.XhrIo.prototype.active_ = false;


/**
 * Last URI that was requested.
 * @type {string}
 * @private
 */
goog.testing.net.XhrIo.prototype.lastUri_ = '';


/**
 * Last error code.
 * @type {goog.net.ErrorCode}
 * @private
 */
goog.testing.net.XhrIo.prototype.lastErrorCode_ =
    goog.net.ErrorCode.NO_ERROR;


/**
 * Last error message.
 * @type {string}
 * @private
 */
goog.testing.net.XhrIo.prototype.lastError_ = '';


/**
 * Mock ready state.
 * @type {number}
 * @private
 */
goog.testing.net.XhrIo.prototype.readyState_ =
    goog.net.XmlHttp.ReadyState.UNINITIALIZED;


/**
 * Number of milliseconds after which an incomplete request will be aborted and
 * a {@link goog.net.EventType.TIMEOUT} event raised; 0 means no timeout is set.
 * @type {number}
 * @private
 */
goog.testing.net.XhrIo.prototype.timeoutInterval_ = 0;


/**
 * Window timeout ID used to cancel the timeout event handler if the request
 * completes successfully.
 * @type {Object}
 * @private
 */
goog.testing.net.XhrIo.prototype.timeoutId_ = null;


/**
 * Returns the number of milliseconds after which an incomplete request will be
 * aborted, or 0 if no timeout is set.
 * @return {number} Timeout interval in milliseconds.
 */
goog.testing.net.XhrIo.prototype.getTimeoutInterval = function() {
  return this.timeoutInterval_;
};


/**
 * Sets the number of milliseconds after which an incomplete request will be
 * aborted and a {@link goog.net.EventType.TIMEOUT} event raised; 0 means no
 * timeout is set.
 * @param {number} ms Timeout interval in milliseconds; 0 means none.
 */
goog.testing.net.XhrIo.prototype.setTimeoutInterval = function(ms) {
  this.timeoutInterval_ = Math.max(0, ms);
};


/**
 * Causes timeout events to be fired.
 */
goog.testing.net.XhrIo.prototype.simulateTimeout = function() {
  this.lastErrorCode_ = goog.net.ErrorCode.TIMEOUT;
  this.dispatchEvent(goog.net.EventType.TIMEOUT);
  this.abort(goog.net.ErrorCode.TIMEOUT);
};


/**
 * Abort the current XMLHttpRequest
 * @param {goog.net.ErrorCode=} opt_failureCode Optional error code to use -
 *     defaults to ABORT.
 */
goog.testing.net.XhrIo.prototype.abort = function(opt_failureCode) {
  if (this.active_) {
    this.active_ = false;
    this.lastErrorCode_ = opt_failureCode || goog.net.ErrorCode.ABORT;
    this.dispatchEvent(goog.net.EventType.COMPLETE);
    this.dispatchEvent(goog.net.EventType.ABORT);
  }
};


/**
 * Simulates the XhrIo send.
 * @param {string} url Uri to make request too.
 * @param {string=} opt_method Send method, default: GET.
 * @param {string=} opt_content Post data.
 * @param {Object|goog.structs.Map=} opt_headers Map of headers to add to the
 *     request.
 */
goog.testing.net.XhrIo.prototype.send = function(url, opt_method, opt_content,
                                                 opt_headers) {
  if (this.active_) {
    throw Error('[goog.net.XhrIo] Object is active with another request');
  }

  this.lastUri_ = url;

  if (this.testQueue_) {
    this.testQueue_.enqueue(['s', url, opt_method, opt_content, opt_headers]);
  }
  this.readyState_ = goog.net.XmlHttp.ReadyState.UNINITIALIZED;
  this.simulateReadyStateChange(goog.net.XmlHttp.ReadyState.LOADING);
  this.active_ = true;
};


/**
 * Simulates changing to the new ready state.
 * @param {number} readyState Ready state to change to.
 */
goog.testing.net.XhrIo.prototype.simulateReadyStateChange =
    function(readyState) {
  if (readyState < this.readyState_) {
    throw Error('Readystate cannot go backwards');
  }

  while (this.readyState_ < readyState) {
    this.readyState_++;
    this.dispatchEvent(goog.net.EventType.READY_STATE_CHANGE);

    if (this.readyState_ == goog.net.XmlHttp.ReadyState.COMPLETE) {
      this.active_ = false;
      this.dispatchEvent(goog.net.EventType.COMPLETE);
    }
  }
};


/**
 * Simulates receiving a response.
 * @param {number} statusCode Simulated status code.
 * @param {string|Document} response Simulated response.
 * @param {Object=} opt_headers Simulated response headers.
 */
goog.testing.net.XhrIo.prototype.simulateResponse = function(statusCode,
    response, opt_headers) {
  this.statusCode_ = statusCode;
  this.response_ = response;
  this.responseHeaders_ = opt_headers || {};
  this.simulateReadyStateChange(goog.net.XmlHttp.ReadyState.COMPLETE);

  if (this.isSuccess()) {
    this.dispatchEvent(goog.net.EventType.SUCCESS);
  } else {
    this.lastErrorCode_ = goog.net.ErrorCode.HTTP_ERROR;
    this.lastError_ = this.getStatusText() + ' [' + this.getStatus() + ']';
    this.dispatchEvent(goog.net.EventType.ERROR);
  }
};


/**
 * Simulates the Xhr is ready for the next request.
 */
goog.testing.net.XhrIo.prototype.simulateReady = function() {
  this.dispatchEvent(goog.net.EventType.READY);
};


/**
 * @return {boolean} Whether there is an active request.
 */
goog.testing.net.XhrIo.prototype.isActive = function() {
  return this.active_;
};


/**
 * Has the request completed.
 * @return {boolean} Whether the request has completed.
 */
goog.testing.net.XhrIo.prototype.isComplete = function() {
  return this.readyState_ == goog.net.XmlHttp.ReadyState.COMPLETE;
};


/**
 * Has the request compeleted with a success.
 * @return {boolean} Whether the request compeleted successfully.
 */
goog.testing.net.XhrIo.prototype.isSuccess = function() {
  switch (this.statusCode_) {
    case 0:         // Used for local XHR requests
    case 200:       // HTTP Success
    case 204:       // HTTP Success - no content
    case 304:       // HTTP Cache
      return true;

    default:
      return false;
  }
};


/**
 * Returns the readystate.
 * @return {number} goog.net.XmlHttp.ReadyState.*.
 */
goog.testing.net.XhrIo.prototype.getReadyState = function() {
  return this.readyState_;
};


/**
 * Get the status from the Xhr object.  Will only return correct result when
 * called from the context of a callback.
 * @return {number} Http status.
 */
goog.testing.net.XhrIo.prototype.getStatus = function() {
  return this.statusCode_;
};


/**
 * Get the status text from the Xhr object.  Will only return correct result
 * when called from the context of a callback.
 * @return {string} Status text.
 */
goog.testing.net.XhrIo.prototype.getStatusText = function() {
  return '';
};


/**
 * Gets the last error message.
 * @return {goog.net.ErrorCode} Last error code.
 */
goog.testing.net.XhrIo.prototype.getLastErrorCode = function() {
  return this.lastErrorCode_;
};


/**
 * Gets the last error message.
 * @return {string} Last error message.
 */
goog.testing.net.XhrIo.prototype.getLastError = function() {
  return this.lastError_;
};


/**
 * Gets the last URI that was requested.
 * @return {string} Last URI.
 */
goog.testing.net.XhrIo.prototype.getLastUri = function() {
  return this.lastUri_;
};


/**
 * Gets the response text from the Xhr object.  Will only return correct result
 * when called from the context of a callback.
 * @return {string} Result from the server.
 */
goog.testing.net.XhrIo.prototype.getResponseText = function() {
  return goog.isString(this.response_) ? this.response_ :
         goog.dom.xml.serialize(this.response_);
};


/**
 * Gets the response and evaluates it as JSON from the Xhr object.  Will only
 * return correct result when called from the context of a callback.
 * @return {Object} JavaScript object.
 */
goog.testing.net.XhrIo.prototype.getResponseJson = function() {
  return goog.json.parse(this.getResponseText());
};


/**
 * Gets the response XML from the Xhr object.  Will only return correct result
 * when called from the context of a callback.
 * @return {Document} Result from the server if it was XML.
 */
goog.testing.net.XhrIo.prototype.getResponseXml = function() {
  // NOTE: I haven't found out how to check in Internet Explorer
  // whether the response is XML document, so I do it the other way around.
  return goog.isString(this.response_) ? null : this.response_;
};


/**
 * Get the value of the response-header with the given name from the Xhr object
 * Will only return correct result when called from the context of a callback
 * and the request has completed
 * @param {string} key The name of the response-header to retrieve.
 * @return {string|undefined} The value of the response-header named key.
 */
goog.testing.net.XhrIo.prototype.getResponseHeader = function(key) {
  return this.isComplete() ? this.responseHeaders_[key] : undefined;
};
