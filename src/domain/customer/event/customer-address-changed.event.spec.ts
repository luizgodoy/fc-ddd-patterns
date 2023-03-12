import EventDispatcher from "../../@shared/event/event-dispatcher";
import Customer from "../entity/customer";
import Address from "../value-object/address";
import CustomerAddressChangedEvent from "./customer-address-changed.event";
import ConsoleLogWhenCustomerAddressIsChangedHandler from "./handler/console-log-when-customer-addresss-is-changed.handler";

describe("Customer address changed domain events tests", () => {

  it("should notify all event handlers", () => {

    const eventDispatcher = new EventDispatcher();
    const eventHandler = new ConsoleLogWhenCustomerAddressIsChangedHandler();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");

    eventDispatcher.register("CustomerAddressChangedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"][0]
    ).toMatchObject(eventHandler);

    const customer = new Customer("1", "Customer 1");
    const address = new Address("Street 1", 123, "13330-250", "São Paulo");
    customer.Address = address;

    const customerAddressChangedEvent = new CustomerAddressChangedEvent(customer);

    // Quando o notify for executado o ConsoleLogWhenCustomerAddressIsChangedHandler.handle() deve ser chamado
    eventDispatcher.notify(customerAddressChangedEvent);
    expect(spyEventHandler).toHaveBeenCalled();
  });
});
