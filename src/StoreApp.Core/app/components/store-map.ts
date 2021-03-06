/// <amd-dependency path="text!./store-map.html" />
import * as $ from "jquery";
import * as ko from "knockout";
import { repositoryFactory } from "../repositories/repositoryFactory";

export class StoreMapViewModel {
  showFirstProduct = ko.observable(false);
  firstProductCustomer = ko.observable("");
  firstProductName = ko.observable("");
  showSecondProduct = ko.observable(false);
  showThirdProduct = ko.observable(false);
  repository = repositoryFactory.get();

  clickLogin = () => {};

  clickTest = () => {};

  constructor() {
    this.checkForNewEvents();
    this.firstProductCustomer("Patrick");
    this.firstProductName("'Canvas Twin Gore Slip-On'");
  }

  checkForNewEvents = () => {
    const eventsPromise = this.repository.getProductScannedEvents();

    eventsPromise
      .then((events: any) => {
        events.items.forEach((event: Models.TrackEvent) => {
          this.showFirstProduct(true);
          setTimeout(() => {
            this.showFirstProduct(false);
          }, 3000);
        });
      })
      .then(() => setTimeout(this.checkForNewEvents, 10000));
  };
}
