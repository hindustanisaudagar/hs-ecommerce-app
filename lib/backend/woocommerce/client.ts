import axios from 'axios'
import { getAppSettings } from '../settings'

export class WooCommerceClient {
  private baseUrl: string = ''
  private consumerKey: string = ''
  private consumerSecret: string = ''
  private initialized: boolean = false
  
  async init() {
    if (this.initialized) return
    
    const settings = await getAppSettings()
    this.baseUrl = settings.woocommerce_url.replace(/\/$/, '')
    this.consumerKey = settings.woocommerce_consumer_key
    this.consumerSecret = settings.woocommerce_consumer_secret
    this.initialized = true
  }
  
  async get(endpoint: string, params?: any) {
    await this.init()
    
    if (!this.baseUrl || !this.consumerKey || !this.consumerSecret) {
      throw new Error('WooCommerce credentials not configured')
    }
    
    const response = await axios.get(`${this.baseUrl}/wp-json/wc/v3/${endpoint}`, {
      params,
      auth: {
        username: this.consumerKey,
        password: this.consumerSecret,
      },
      timeout: 15000,
    })
    
    return response.data
  }
  
  async post(endpoint: string, data: any) {
    await this.init()
    
    if (!this.baseUrl || !this.consumerKey || !this.consumerSecret) {
      throw new Error('WooCommerce credentials not configured')
    }
    
    const response = await axios.post(`${this.baseUrl}/wp-json/wc/v3/${endpoint}`, data, {
      auth: {
        username: this.consumerKey,
        password: this.consumerSecret,
      },
      timeout: 15000,
    })
    
    return response.data
  }
  
  async put(endpoint: string, data: any) {
    await this.init()
    
    if (!this.baseUrl || !this.consumerKey || !this.consumerSecret) {
      throw new Error('WooCommerce credentials not configured')
    }
    
    const response = await axios.put(`${this.baseUrl}/wp-json/wc/v3/${endpoint}`, data, {
      auth: {
        username: this.consumerKey,
        password: this.consumerSecret,
      },
      timeout: 15000,
    })
    
    return response.data
  }
  
  async delete(endpoint: string) {
    await this.init()
    
    if (!this.baseUrl || !this.consumerKey || !this.consumerSecret) {
      throw new Error('WooCommerce credentials not configured')
    }
    
    const response = await axios.delete(`${this.baseUrl}/wp-json/wc/v3/${endpoint}`, {
      auth: {
        username: this.consumerKey,
        password: this.consumerSecret,
      },
      timeout: 15000,
    })
    
    return response.data
  }
}
