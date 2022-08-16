import { format } from "date-fns";
import { InvoiceDto } from "types/invoice";

// Todo place this function in context and mock context in the story.
export const getGroupedInvoices = (invoices: InvoiceDto[]) => {
  return Object.entries(
    invoices.reduce((invoicesByDuedate, invoice) => {
      console.log({ dueDate: invoice.dueDate });

      const dateMonth = format(new Date(invoice.dueDate), "MM/yyyy");
      return {
        ...invoicesByDuedate,
        [dateMonth]: [...(invoicesByDuedate[dateMonth] || []), invoice],
      };
    }, {} as { [key: string]: InvoiceDto[] })
  );
};

// TODO FP invoice validation https://marmelab.com/blog/2018/09/26/functional-programming-3-functor-redone.html
// const isNothing = <T>(value: T) =>
//   value === null || typeof value === "undefined";

// const Maybe = <T>(value: T) => ({
//   map: <B = T>(fn: (a: T) => B) => (isNothing(value) ? Maybe(null) : Maybe(fn(value))),
//   getOrElse: <E = String>(defaultValue: E) =>
//     isNothing(value) ? defaultValue : value,
//   flatten: () => (isNothing(value) ? Maybe(null) : Maybe((value as any).value)),
//   chain(fn: (a: T) => B) {
//     return this.map(fn).flatten();
//   },
// });

// const Left = <T>(value: T) => ({
//   map: (_fn: (a: T) => T) => Left(value),
//   catch: (fn: (a: T) => T) => Right(fn(value)),
//   value,
// });

// const Right = <T>(value: T) => ({
//   map: (fn: (a: T) => T) => Right(fn(value)),
//   catch: () => Right(value),
//   value,
// });


// console.log(
//   Maybe(undefined)
//     .map((x) => x)
//     .getOrElse("No Invoice")
// );

// const tryCatch =
//   <T>(fn: (a: T) => T) =>
//   (value: T) => {
//     try {
//       return Right(fn(value)); // everything went fine we go right
//     } catch (error) {
//       return Left(error); // oops there was an error let's go left.
//     }
//   };

// const validateEmail = tryCatch<String>((value) => {
//   if (!value.match(/\S+@\S+\.\S+/)) {
//     throw new Error("The given email is invalid");
//   }
//   return value;
// });
// const get = (key:string) => (value: {[key: string]: any}) => value[key];


// const validateUser = (invoice:InvoiceDto) => Maybe<InvoiceDto>(invoice)
//     .map<String>(get('email'))
//     .chain(v =>  validateEmail(v)
//         .catch(get('message'))
//     )
//     .getOrElse('The user has no mail');