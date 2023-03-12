import EventDispatcher from "../../@shared/event/event-dispatcher";
import Customer from "../entity/customer";
import Address from "../value-object/address";
import CustomerCreatedEvent from "./customer-created.event";
import ConsoleLogWhenCustomerIsCreated2Handler from "./handler/console-log-when-customer-is-created-2.handler";
import ConsoleLogWhenCustomerIsCreatedHandler from "./handler/console-log-when-customer-is-created.handler";

describe("Customer created domain events tests", () => {

  it("should notify all event handlers", () => {

    const eventDispatcher = new EventDispatcher();
    const eventHandler = new ConsoleLogWhenCustomerIsCreatedHandler();
    const eventHandler2 = new ConsoleLogWhenCustomerIsCreated2Handler();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");
    const spyEventHandler2 = jest.spyOn(eventHandler2, "handle");

    eventDispatcher.register("CustomerCreatedEvent", eventHandler);
    eventDispatcher.register("CustomerCreatedEvent", eventHandler2);

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]
    ).toMatchObject(eventHandler2);

    const customer = new Customer("1", "Customer 1");
    const address = new Address("Street 1", 123, "13330-250", "São Paulo");
    customer.Address = address;

    const customerCreatedEvent = new CustomerCreatedEvent(customer);

    // Quando o notify for executado o ConsoleLogWhenCustomerAddressIsChangedHandler.handle() deve ser chamado
    eventDispatcher.notify(customerCreatedEvent);
    expect(spyEventHandler).toHaveBeenCalled();
    expect(spyEventHandler2).toHaveBeenCalled();
  });
});
