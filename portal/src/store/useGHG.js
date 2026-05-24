import { useContext } from 'react'
import { GHGContext } from './GHGContextValue'

export function useGHG() {
  return useContext(GHGContext)
}
