import Util from '@services/util';

export default class ConfirmationDialog {

  /**
   * General purpose confirmation dialog.
   * Currently wrapping H5P.ConfirmationDialog. May be replaced later on.
   * @class
   * @param {object} [params] Parameters, same as H5P.ConfirmationDialog.
   * @param {object} [callbacks] Callbacks.
   * @param {function} [callbacks.onConfirmed] Called when user confirms.
   * @param {function} [callbacks.onCanceled] Called when user cancels.
   */
  constructor(params = {}, callbacks = {}) {
    this.params = Util.extend({}, params);

    this.dom = document.createElement('div');
    this.dom.classList.add('h5p-content-compiler-confirmation-dialog');

    this.update(params, callbacks);
  }

  /**
   * Get DOM.
   * @returns {HTMLElement} DOM.
   */
  getDOM() {
    return this.dom;
  }

  /**
   * Update.
   * @param {object} [params] Parameters, same as H5P.ConfirmationDialog.
   * @param {object} [callbacks] Callbacks.
   * @param {function} [callbacks.onConfirmed] Called when user confirms.
   * @param {function} [callbacks.onCanceled] Called when user cancels.
   */
  update(params = {}, callbacks = {}) {
    params = Util.extend({
      instance: this.params.globals.get('mainInstance'),
    }, params);

    callbacks = Util.extend({
      onConfirmed: () => {},
      onCanceled: () => {}
    }, callbacks);

    // Clean up old dialog
    if (this.dialog) {
      this.dialog.off('confirmed');
      this.dialog.off('canceled');

      if (!this.dialog.getElement().classList.contains('hidden')) {
        this.dialog.hide();
      }
    }

    this.dialog = new H5P.ConfirmationDialog(params);
    this.dialog.once('confirmed', () => {
      this.dialog.off('canceled');
      this.isShowing = false;

      callbacks.onConfirmed();
    });

    this.dialog.once('canceled', () => {
      this.dialog.off('confirmed');
      this.isShowing = false;

      callbacks.onCanceled();
    });

    this.dom.innerHTML = '';
    this.dialog.appendTo(this.dom);
  }

  /**
   * Show.
   */
  show() {
    this.dialog.show();
    this.isShowing = true;
  }

  /**
   * Hide.
   */
  hide() {
    if (!this.isShowing) {
      return;
    }

    this.dialog.hide();
    this.isShowing = false;
  }
}
