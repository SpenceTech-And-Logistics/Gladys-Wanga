import { createContext, useContext } from 'react'
import { LISTS, defaults } from '../data/content.js'

export const ContentContext = createContext({ ...defaults, lists: { ...LISTS, subcounties: defaults.county.subcounties }, live: false, refresh: () => {} })
export const useContent = () => useContext(ContentContext)
