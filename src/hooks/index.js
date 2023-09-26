const allModules = import.meta.globEager('./*.js')
const modules = {}
Object.keys(allModules).forEach(key => {
  modules[key.replace(/(\.\/|\.js)/g, '')] = allModules[key].default
})

export const useIndexBanner = modules.useIndexBanner
