const info = (...params) => {
    if (process.env.NODE_ENV !== 'test') {
        console.log(...params)
    }
}
  
const _error = (...params) => {
    if (process.env.NODE_ENV !== 'test') {
        console.error(...params)
    }
}
  
export { info, _error }