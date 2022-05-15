import prod from './prod'
import local from './local'

const config = process.env.NODE_ENV === 'production' ? prod : local

export default config