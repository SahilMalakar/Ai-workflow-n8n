export interface CustomerMock {
  customerId: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

export interface OrderMock {
  orderId: string;
  customerId: string;
  orderDate: string;
  totalAmount: number;
  status: string;
}

export interface InvoiceMock {
  invoiceId: string;
  orderId: string;
  customerId: string;
  invoiceDate: string;
  dueDate: string;
  amount: number;
  paid: boolean;
}

const sampleNames = [
  "Maja Keller",
  "Lukas Meier",
  "Sara Müller",
  "Noah Weber",
  "Emma Schmid",
  "Jonas Fischer",
  "Lena Baumann",
  "Tim Huber",
  "Nina Steiner",
  "Maximilian Frei",
];

const orderStatuses = ["draft", "confirmed", "shipped", "paid", "cancelled"];

const padNumber = (value: number, length = 3): string =>
  String(value).padStart(length, "0");

const randomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const randomFrom = <T>(items: T[]): T =>
  items[Math.floor(Math.random() * items.length)];

const randomDate = (start: Date, end: Date): Date =>
  new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

const timestampISO = (date: Date): string => date.toISOString();

const formatPhone = (): string =>
  `+41 ${randomInt(70, 79)} ${randomInt(100, 999)} ${randomInt(10, 99)}`;

export const generateMockCustomers = (count: number): CustomerMock[] => {
  const now = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(now.getFullYear() - 1);

  return Array.from({ length: count }, (_, index) => {
    const customerId = `CUST-${padNumber(index + 1, 4)}`;
    const name = sampleNames[index % sampleNames.length];
    const createdAt = timestampISO(randomDate(oneYearAgo, now));

    return {
      customerId,
      name,
      email: `${name
        .toLowerCase()
        .replace(/\s+/g, ".")
        .replace(/[^a-z.]/g, "")}@example.ch`,
      phone: formatPhone(),
      createdAt,
    };
  });
};

export const generateMockOrders = (
  customers: CustomerMock[],
  minOrdersPerCustomer = 1,
  maxOrdersPerCustomer = 3,
): OrderMock[] => {
  const now = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(now.getMonth() - 6);

  return customers.flatMap((customer, customerIndex) => {
    const orderCount = randomInt(minOrdersPerCustomer, maxOrdersPerCustomer);
    return Array.from({ length: orderCount }, (_, orderIndex) => {
      const orderId = `ORD-${padNumber(customerIndex * 10 + orderIndex + 1, 5)}`;
      const orderDate = timestampISO(randomDate(sixMonthsAgo, now));
      const totalAmount = Number(
        (randomInt(150, 4200) + Math.random()).toFixed(2),
      );
      const status = randomFrom(orderStatuses);

      return {
        orderId,
        customerId: customer.customerId,
        orderDate,
        totalAmount,
        status,
      };
    });
  });
};

export const generateMockInvoices = (
  orders: OrderMock[],
  minInvoicesPerOrder = 1,
  maxInvoicesPerOrder = 1,
): InvoiceMock[] => {
  return orders.flatMap((order, orderIndex) => {
    const invoiceCount = randomInt(minInvoicesPerOrder, maxInvoicesPerOrder);
    const orderDate = new Date(order.orderDate);

    return Array.from({ length: invoiceCount }, (_, invoiceIndex) => {
      const invoiceId = `INV-${padNumber(orderIndex * 5 + invoiceIndex + 1, 6)}`;
      const invoiceDate = timestampISO(
        new Date(orderDate.getTime() + randomInt(0, 5) * 24 * 60 * 60 * 1000),
      );
      const dueDate = timestampISO(
        new Date(orderDate.getTime() + randomInt(15, 45) * 24 * 60 * 60 * 1000),
      );
      const amount = Number(
        (
          order.totalAmount * (invoiceCount === 1 ? 1 : 1 / invoiceCount)
        ).toFixed(2),
      );
      const paid = Math.random() > 0.25;

      return {
        invoiceId,
        orderId: order.orderId,
        customerId: order.customerId,
        invoiceDate,
        dueDate,
        amount,
        paid,
      };
    });
  });
};

export interface MockDataSet {
  customers: CustomerMock[];
  orders: OrderMock[];
  invoices: InvoiceMock[];
}

export const generateMockData = (
  customerCount: number,
  minOrdersPerCustomer = 1,
  maxOrdersPerCustomer = 3,
  minInvoicesPerOrder = 1,
  maxInvoicesPerOrder = 1,
): MockDataSet => {
  const customers = generateMockCustomers(customerCount);
  const orders = generateMockOrders(
    customers,
    minOrdersPerCustomer,
    maxOrdersPerCustomer,
  );
  const invoices = generateMockInvoices(
    orders,
    minInvoicesPerOrder,
    maxInvoicesPerOrder,
  );

  return {
    customers,
    orders,
    invoices,
  };
};
