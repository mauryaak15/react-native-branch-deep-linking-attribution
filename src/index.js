import { NativeModules, Platform } from 'react-native'

const { RNBranch } = NativeModules

import createBranchUniversalObject from './branchUniversalObject'
import BranchEvent from './BranchEvent'
import BranchSubscribe from './BranchSubscriber'

const packageFile = require('./../package.json')
export const VERSION = packageFile.version

export const AddToCartEvent = RNBranch.ADD_TO_CART_EVENT
export const AddToWishlistEvent = RNBranch.ADD_TO_WISHLIST_EVENT
export const PurchasedEvent = RNBranch.PURCHASED_EVENT
export const PurchaseInitiatedEvent = RNBranch.PURCHASE_INITIATED_EVENT
export const RegisterViewEvent = RNBranch.REGISTER_VIEW_EVENT
export const ShareCompletedEvent = RNBranch.SHARE_COMPLETED_EVENT
export const ShareInitiatedEvent = RNBranch.SHARE_INITIATED_EVENT

class Branch {
  key = null;
  _checkCachedEvents = true;
  _debug = false;

  constructor(options = {}) {
    if (options.debug) this._debug = true

    console.info('Initializing react-native-branch v. ' + VERSION)
  }

  subscribe(options) {
    if (typeof options === function) {
      options = {
        checkCachedEvents: this._checkCachedEvents,
        onOpenComplete: options,
      }
    }

    const subscriber = new BranchSubscriber(options)
    subscriber.subscribe()

    const unsubscribe = () => {
      subscriber.unsubscribe()
    }

    return unsubscribe
  }

  skipCachedEvents() {
    /*** Sets to ignore cached events. ***/
    this._checkCachedEvents = false
  }

  /*** Tracking related methods ***/
  disableTracking = (disable) => RNBranch.disableTracking(disable)
  isTrackingDisabled = RNBranch.isTrackingDisabled

  /*** RNBranch singleton methods ***/
  setDebug = () => { throw 'setDebug() is not supported in the RN SDK. For other solutions, please see https://rnbranch.app.link/setDebug' }
  getLatestReferringParams = (synchronous = false) => RNBranch.getLatestReferringParams(synchronous)
  getFirstReferringParams = RNBranch.getFirstReferringParams
  setIdentity = (identity) => RNBranch.setIdentity(identity)
  setRequestMetadata = (key, value) => {
    console.info('[Branch] setRequestMetadata has limitations when called from JS.  Some network calls are made prior to the JS layer being available, those calls will not have the metadata.')
    return RNBranch.setRequestMetadataKey(key, value)
  }
  logout = RNBranch.logout
  userCompletedAction = (event, state = {}) => RNBranch.userCompletedAction(event, state)
  getShortUrl = RNBranch.getShortUrl
  sendCommerceEvent = (revenue, metadata) => {
    console.info('[Branch] sendCommerceEvent is deprecated. Please use the BranchEvent class instead.')
    return RNBranch.sendCommerceEvent('' + revenue, metadata)
  }
  openURL = (url, options = {}) => {
    return Platform.select({
      android: () => RNBranch.openURL(url, options),
      ios: () => RNBranch.openURL(url)
    })()
  }

  /*** Referral Methods ***/
  redeemRewards = (amount, bucket) => RNBranch.redeemRewards(amount, bucket)
  loadRewards = (bucket) => RNBranch.loadRewards(bucket)
  getCreditHistory = RNBranch.getCreditHistory

  /*** BranchUniversalObject ***/
  createBranchUniversalObject = createBranchUniversalObject
}

export { Branch, BranchEvent }
export default new Branch()
