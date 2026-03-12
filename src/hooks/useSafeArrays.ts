import { useMemo } from 'react'

/**
 * Hook para garantir que arrays sejam válidos e evitar erros de .map(), .filter(), etc.
 * @param arrays Objeto com arrays que precisam de validação
 * @returns Objeto com arrays validados
 */
export function useSafeArrays<T extends Record<string, any>>(arrays: T): T {
  return useMemo(() => {
    const safeArrays = {} as T
    
    for (const [key, value] of Object.entries(arrays)) {
      safeArrays[key as keyof T] = Array.isArray(value) ? value : []
    }
    
    return safeArrays
  }, [arrays])
}

/**
 * Função utilitária para garantir que um valor seja um array
 * @param value Valor a ser validado
 * @returns Array válido ou array vazio
 */
export function ensureArray<T>(value: T[] | undefined | null): T[] {
  return Array.isArray(value) ? value : []
}

/**
 * Função utilitária para operações seguras com arrays
 * @param array Array a ser validado
 * @param callback Função a ser executada se o array for válido
 * @param fallback Valor de retorno caso o array seja inválido
 */
export function safeArrayOperation<T, R>(
  array: T[] | undefined | null, 
  callback: (arr: T[]) => R, 
  fallback: R
): R {
  return Array.isArray(array) && array.length > 0 ? callback(array) : fallback
}