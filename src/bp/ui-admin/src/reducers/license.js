import api from '../api'
import { logout } from '../Auth/licensing'

export const FETCH_LICENSE_RECEIVED = 'license/FETCH_LICENSE_RECEIVED'
export const FETCH_LICENSING_RECEIVED = 'license/FETCH_LICENSING_RECEIVED'
export const FETCH_KEYS_REQUESTED = 'license/FETCH_KEYS_REQUESTED'
export const FETCH_KEYS_RECEIVED = 'license/FETCH_KEYS_RECEIVED'
export const UPDATE_LICENSING_ACCOUNT = 'license/UPDATE_LICENSING_ACCOUNT'
export const FETCH_PRODUCTS_REQUESTED = 'license/FETCH_PRODUCTS_REQUESTED'
export const FETCH_PRODUCTS_RECEIVED = 'license/FETCH_PRODUCTS_RECEIVED'
export const LOGOUT_USER_FROM_LICENSE_SERVER = 'license/LOGOUT_USER_FROM_LICENSE_SERVER'

const initialState = {
  license: null,
  licensing: null,
  keys: null,
  products: null,
  fetchingKeys: false,
  fetchingProducts: false,
  licensingAccount: null
}

export default (state = initialState, action) => {
  switch (action.type) {
    case LOGOUT_USER_FROM_LICENSE_SERVER:
      return {
        ...initialState
      }
    case FETCH_LICENSE_RECEIVED:
      return {
        ...state,
        license: action.license
      }

    case FETCH_LICENSING_RECEIVED:
      return {
        ...state,
        licensing: action.licensing
      }

    case FETCH_KEYS_REQUESTED:
      return {
        ...state,
        fetchingKeys: true
      }

    case FETCH_KEYS_RECEIVED:
      return {
        ...state,
        keys: action.keys,
        fetchingKeys: false
      }

    case UPDATE_LICENSING_ACCOUNT:
      return {
        ...state,
        licensingAccount: action.account
      }

    case FETCH_PRODUCTS_REQUESTED:
      return {
        ...state,
        fetchingProducts: true
      }

    case FETCH_PRODUCTS_RECEIVED:
      return {
        ...state,
        products: action.products,
        fetchingProducts: false
      }

    default:
      return state
  }
}

export const logoutUser = () => {
  logout()
  return {
    type: LOGOUT_USER_FROM_LICENSE_SERVER
  }
}

export const fetchLicense = () => {
  return async dispatch => {
    const license = await api
      .getAnonymous()
      .get('/admin/license')
      .then(({ data }) => data)

    dispatch({ type: FETCH_LICENSE_RECEIVED, license })
  }
}

export const fetchLicensing = () => {
  return async dispatch => {
    const { data } = await api.getSecured({ toastErrors: false }).get(`admin/license/status`)

    dispatch({
      type: FETCH_LICENSING_RECEIVED,
      licensing: data.payload
    })
  }
}

export const fetchAllKeys = () => async dispatch => {
  dispatch({ type: FETCH_KEYS_REQUESTED })

  const licensing = await api.getLicensing()
  const { data } = await licensing.get('/me/keys')
  dispatch({
    type: FETCH_KEYS_RECEIVED,
    keys: data.licenses
  })
}

export const fetchProducts = () => async dispatch => {
  dispatch({ type: FETCH_PRODUCTS_REQUESTED })
  const licensing = await api.getLicensing()
  const { data } = await licensing.get(`/prices`)

  dispatch({
    type: FETCH_PRODUCTS_RECEIVED,
    products: data.products
  })
}

export const updateLicensingAccount = account => async dispatch => {
  dispatch({
    type: UPDATE_LICENSING_ACCOUNT,
    account
  })
}