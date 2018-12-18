import * as ko from "knockout";
import { config } from "./../config";
import { IRepository } from "./IRepository";

export class Repository implements IRepository {
  private baseUrl: string = "http://modernstorefront-quicksilver.localtest.me/";
  private baseContentDeliveryApiUrl: string =
    this.baseUrl + "api/episerver/v2.0/content/";
  private baseServiceApiUrl: string = this.baseUrl + "episerverapi/";

  private serviceApiAccessToken = ko
    .observable<string>()
    .subscribeTo("serviceApiAccessToken", true);

  public async products(): Promise<Models.Product[]> {
    var response = await window.fetch(`/data/products.json`);
    return response.json();
  }

  public async product(code: string): Promise<Models.Product> {
    var products = await this.products();
    return products.find(product => {
      return product.code === code;
    });
  }

  public createClickAndCollectOrder(
    store: Models.Store,
    product: Models.Product,
    size: string
  ): Models.Order {
    return {
      orderNumber: Math.ceil(Math.random() * 1000).toString(),
      size: size,
      store: store,
      product: product,
      type: Models.OrderType.ClickAndCollect
    };
  }

  public async createOrder(
    store: Models.Store,
    product: Models.Product,
    size: string,
    customer: Models.Contact,
    paymentResponse: PaymentResponse
  ): Promise<Models.Order> {
    const orderNumber = "POApp" + new Date().getTime();
    const fullName = customer.firstName + " " + customer.lastName;
    const order = {
      orderNumber: orderNumber,
      billingCurrency: "USD",
      customerId: customer.primaryKeyId,
      customerName: customer.firstName + " " + customer.lastName,
      marketId: "US",
      name: "StoreApp",
      orderAddresses: [
        {
          name: "DefaultAddress",
          firstName: customer.firstName,
          lastName: customer.lastName,
          line1: paymentResponse.shippingAddress.addressLine.join(),
          city: paymentResponse.shippingAddress.city,
          countryName: paymentResponse.shippingAddress.country,
          postalCode: paymentResponse.shippingAddress.postalCode,
          regionCode: paymentResponse.shippingAddress.region,
          daytimePhoneNumber: paymentResponse.shippingAddress.phone,
          email: customer.email
        }
      ],
      orderForms: [
        {
          shipments: [
            {
              shippingMethodId: paymentResponse.shippingOption,
              shippingAddressId: "DefaultAddress",
              warehouseCode: store.code,
              lineItems: [
                {
                  code: product.code,
                  displayName: product.title,
                  placedPrice: product.price,
                  quantity: 1
                }
              ]
            }
          ],
          payments: [
            {
              amount: product.price,
              billingAddressId: "DefaultAddress",
              customerName: fullName,
              paymentMethodId: "4a671211-9441-432c-aab0-bde96a51da9a",
              paymentMethodName: "GenericCreditCard",
              status: "Pending",
              implementationClass:
                "Mediachase.Commerce.Orders.CreditCardPayment,Mediachase.Commerce",
              transactionType: "Authorization"
            }
          ],
          name: fullName,
          billingAddressId: "DefaultAddress",
          properties: []
        }
      ],
      status: "InProgress"
    };

    const response = await fetch(this.baseServiceApiUrl + "commerce/orders", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: "bearer " + this.serviceApiAccessToken()
      },
      body: JSON.stringify(order)
    });

    return response.json().then(() => {
      return {
        orderNumber: orderNumber,
        size: size,
        store: store,
        product: product,
        type: Models.OrderType.Standard
      };
    });
  }

  /* SERVICE API */
  public async getServiceApiToken(): Promise<any> {
    const response = await fetch(this.baseServiceApiUrl + "token", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body:
        "grant_type=password&username=" +
        config.serviceApiUser +
        "&password=" +
        config.serviceApiPassword
    });

    return response.json();
  }

  public async getCurrentCustomer(contactId: string): Promise<Models.Contact> {
    const response = await fetch(
      this.baseServiceApiUrl + "commerce/customers/contact/" + contactId,
      {
        mode: "cors",
        method: "GET", // *GET, POST, PUT, DELETE, etc.
        headers: {
          "Content-Type": "application/json",
          Authorization: "bearer " + this.serviceApiAccessToken()
        }
      }
    );
    return response.json();
  }

  public async getProducts(): Promise<Models.Product[]> {
    const response = await fetch(
      this.baseServiceApiUrl + "commerce/catalog/products/",
      {
        mode: "cors",
        method: "GET", // *GET, POST, PUT, DELETE, etc.
        headers: {
          "Content-Type": "application/json",
          Authorization: "bearer " + this.serviceApiAccessToken()
        }
      }
    );
    return response.json();
  }

  public async getProduct(code: string): Promise<Models.Product> {
    const response = await fetch(
      this.baseServiceApiUrl + "commerce/catalog/products/" + code,
      {
        mode: "cors",
        method: "GET", // *GET, POST, PUT, DELETE, etc.
        headers: {
          "Content-Type": "application/json",
          Authorization: "bearer " + this.serviceApiAccessToken()
        }
      }
    );
    return response.json();
  }

  public async getStores(): Promise<Models.Store[]> {
    const response = await fetch(
      this.baseServiceApiUrl + "commerce/warehouses/",
      {
        mode: "cors",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "bearer " + this.serviceApiAccessToken()
        }
      }
    );

    const warehouses = await response.json();
    const stores = [];
    warehouses.forEach(item => {
      stores.push(this.createStoreObject(item));
    });
    return stores;
  }

  public async getStore(code: string): Promise<Models.Store> {
    const response = await fetch(
      this.baseServiceApiUrl + "commerce/warehouses/" + code,
      {
        mode: "cors",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "bearer " + this.serviceApiAccessToken()
        }
      }
    );

    const warehouse = await response.json();

    return this.createStoreObject(warehouse);
  }

  public async getShippingOptions(): Promise<PaymentShippingOption[]> {
    const response = await fetch(
      this.baseServiceApiUrl + "commerce/shipment/shipping-options",
      {
        mode: "cors",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "bearer " + this.serviceApiAccessToken()
        }
      }
    );
    const data = await response.json();
    const options: PaymentShippingOption[] = [];
    data.forEach((item: any) => {
      options.push({
        id: item.id,
        label: item.displayName,
        amount: {
          currency: item.price.currency,
          value: item.price.amount.toString()
        }
      });
    });
    return options;
  }

  private createStoreObject(warehouse: any): Models.Store {
    return {
      code: warehouse.code,
      name: warehouse.name
    };
  }

  /* CONTENT DELIVERY API */
  public async getPageContent(page: number): Promise<any> {
    let url = this.baseContentDeliveryApiUrl + page + "?expand=*";
    const response = await fetch(url, {
      method: "GET",

      headers: {
        "Content-Type": "application/json",
        "Accept-Language": "en"
      }
    });
    return response.json();
  }
}
