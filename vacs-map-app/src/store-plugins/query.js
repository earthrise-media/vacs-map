import qs from 'qs'

const toPersist = [
  {
    store: 'filters',
    key: 'selectedCrop',
    outputKey: 'crop'
  },
  {
    store: 'filters',
    key: 'selectedMetric',
    outputKey: 'metric'
  },
  {
    store: 'filters',
    key: 'selectedModel',
    outputKey: 'model'
  },
]

const getParams = (pinia) => {
  return Object.fromEntries(
    toPersist
      .map(({ store, key, outputKey }) => {
        const value = pinia[store]?.[key]
        if (!value) return
        return [outputKey, value]
      })
      .filter((v) => !!v)
  )
}

const setParams = (store, params) => {
  Object.entries(params).forEach(([k, v]) => {
    const matchingEntries = toPersist.filter(
      (entry) => entry.store === store.$id && entry.outputKey === k
    )
    if (matchingEntries.length !== 1) return
    store[matchingEntries[0].key] = v
  })
}

export default ({ pinia, store }) => {
  // On load, parse params and set
  try {
    if (window) {
      const params = qs.parse(window.location.hash.split('?')[1])
      if (Object.keys(params).length > 0) {
        setParams(store, params)
      }
    }
  } catch (e) {
    //
  }

  store.$subscribe(() => {
    const params = getParams(pinia.state.value)
    if (Object.keys(params).length > 0) {
      if (window) {
        const newUrl = location.hash.split('?')[0] + `?${qs.stringify(params)}`
        window.history.replaceState({ ...window.history.state }, '', newUrl)
      }
    }
  })
}
