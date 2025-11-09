<template>
  <div class="invoice-box box">
    <header class="clearfix py-5 px-10">
      <div id="logo">
        <img :src="setting.logo" v-if="setting.logo" class="w-32" />sd
      </div>

      <div id="company">
        <h2 class="name">{{ business.companyName }}</h2>
        <div>{{ business.addressLine1 }} {{ business.addressLine2 }}</div>
        <div>{{ business.city }}, {{ business.state }}, {{ business.zipcode }}</div>
        <div class="email">{{ business.phoneNumber }}</div>
      </div>
    </header>

    <main>
      <div id="details" class="clearfix">
        <div id="client" class="pl-10">
          <div>
            <div class="to">Billed To:</div>
            <h2 class="name"><strong>{{ billedCustomer.customer}}</strong></h2>
            <p>{{billedCustomer.firstName + ' ' + billedCustomer.lastName }}</p>
            <div class="address">{{ billedCustomer.billingAddressLine1 }}</div>
            <div class="address">{{ billedCustomer.billingAddressLine2 }}</div>
            <div class="address">
              {{ billedCustomer.billingCity }}, {{ billedCustomer.billingState }}
              {{ billedCustomer.billingZipcode }}
            </div>
            <div class="address">{{ billedCustomer.billingCountry }}</div>
            <br>
            <div class="email">{{ billedCustomer.email }}</div>
            <div>{{ billedCustomer.phoneNumber ?? billedCustomer.mobileNumber }}</div>
          </div>
          <div style="margin-top: 17px">
            <div class="to">Shipped To:</div>
            <h2 class="name"><strong>{{ billedCustomer.shippingName}}</strong></h2>
            <div class="address">{{ billedCustomer.shippingAddressLine1 }}</div>
            <div class="address">{{ billedCustomer.shippingAddressLine2 }}</div>
            <div class="address">
              {{ billedCustomer.shippingCity }}, {{ billedCustomer.shippingState }}
              {{ billedCustomer.shippingZipcode }}
            </div>
            <div class="address">{{ billedCustomer.shippingPhoneNumber ?? billedCustomer.phoneNumber }}</div>
          </div>
        </div>

        <div id="invoice" class="pr-10">
          <h1>{{ invoice.invoiceTitle ? invoice.invoiceTitle : "invoice" }}</h1>
          <div class="date">Invoice #: {{ invoice.invoiceNumber }}</div>
          <div class="date">Reference #: {{ invoice.referenceNumber }}</div>
          <div class="date">Invoice Date: {{ $h.formatDate(invoice.invoiceDate) }}</div>
          <div class="date">Payment Due: {{ $h.formatDate(invoice.paymentDueDate) }}</div>
        </div>
      </div>

      <table border="0" cellspacing="0" cellpadding="0">
        <thead>
          <tr>
            <th class="no">#</th>
            <th class="desc">
              {{
                setting.invoice_columns.items.name == "others"
                  ? setting.invoice_columns.items.value
                  : setting.invoice_columns.items.name
              }}
            </th>

            <th v-if="!setting.invoice_columns.units.hide">
              {{
                setting.invoice_columns.units.name == "others"
                  ? setting.invoice_columns.units.value
                  : setting.invoice_columns.units.name
              }}
            </th>

            <th class="unit" v-if="!setting.invoice_columns.price.hide">
              {{
                setting.invoice_columns.price.name == "others"
                  ? setting.invoice_columns.price.value
                  : setting.invoice_columns.price.name
              }}
            </th>

            <th v-if="!setting.invoice_columns.taxable.hide">
              {{
                setting.invoice_columns.taxable.name == "others"
                  ? setting.invoice_columns.taxable.value
                  : setting.invoice_columns.taxable.name
              }}
            </th>

            <th class="total" v-if="!setting.invoice_columns.amount.hide">
              {{
                setting.invoice_columns.amount.name == "others"
                  ? setting.invoice_columns.amount.value
                  : setting.invoice_columns.amount.name
              }}
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(item, index) in items" :key="index">
            <td class="no">{{ index + 1 }}</td>
            <td class="desc">
              <p>{{ item.name }}</p>
              <p v-if="!setting.invoice_columns.items.hide">{{ item.description }}</p>
            </td>

            <td class="qty" v-if="!setting.invoice_columns.units.hide">
              {{ item.quantity }}
            </td>
            <td
              class="unit"
              v-html="$h.formatCurrency(item.price)"
              v-if="!setting.invoice_columns.price.hide"
            ></td>
            <td class="tax" v-if="!setting.invoice_columns.taxable.hide">
              {{ item.isTaxable ? "YES" : "NO" }}
            </td>
            <td
              class="total"
              v-html="$h.formatCurrency(item.total)"
              v-if="!setting.invoice_columns.amount.hide"
            ></td>
          </tr>
        </tbody>
      </table>

      <table class="payments-table">
        <tfoot>
          <tr class="payments-heading">
            <td colspan="4">Payments</td>
          </tr>

          <tr class="payments-subheading">
            <td class="date-subheading">Date</td>
            <td class="amount-subheading">Amount</td>
            <td colspan="2" class="type-subheading">Type</td>
          </tr>

          <tr class="payments-info" v-for="(payment, index) in payments" :key="index">
            <td class="date-info">
              <p>{{ $h.formatDate(payment.paymentDate) }}</p>
            </td>
            <td class="amount-info">
              <p style="text-align: left" v-html="$h.formatCurrency(payment.amount)"></p>
            </td>
            <td colspan="4" class="type-info">
              <p>{{ payment.paymentMethod }}</p>
            </td>
          </tr>
        </tfoot>
      </table>

      <table class="total-table">
        <tfoot>
          <tr>
            <td colspan="2"></td>
            <td colspan="2">Subtotal</td>
            <td v-html="$h.formatCurrency(subTotal)"></td>
          </tr>

          <tr class="tax">
            <td></td>
            <td></td>
            <td></td>
            <td style="width: 50%">
              <p class="tax-heading"></p>
            </td>
            <td style="width: 20%">
              <p class="tax-amount"></p>
            </td>
          </tr>

          <tr class="tax-info" v-for="tax in salesTax" :key="tax.id">
            <td colspan="2"></td>
            <td colspan="2">{{ tax.taxAbbreviation }} {{ tax.taxRate }}%:</td>
            <td v-html="$h.formatCurrency(tax.taxAmount)"></td>
          </tr>

          <tr>
            <td colspan="2"></td>
            <td colspan="2">Total:</td>
            <td v-html="$h.formatCurrency(grandTotal)"></td>
          </tr>

          <tr>
            <td colspan="2"></td>
            <td colspan="2">Amount due:</td>
            <td v-html="$h.formatCurrency(invoice.dueAmount)"></td>
          </tr>
        </tfoot>
      </table>

      <div id="thanks"></div>
      <div id="notices">
        <div>Notes / Terms</div>
        <div class="notice">{{ invoice.notes }}</div>
      </div>
    </main>
    <footer class="footer-text p-10">{{ invoice.footerNotes }}</footer>
  </div>
</template>

<script>
import { defineComponent, onMounted } from "vue";
import { useCustomer } from "@/compositions/invoices/customer";
import { saveBusiness, businessDetail } from "@/compositions/business";

export default defineComponent({
  props: [
    "invoice",
    "items",
    "setting",
    "subTotal",
    "grandTotal",
    "salesTax",
    "payments",
  ],
  setup(props) {
    const { billedCustomer } = useCustomer();
    const { business } = saveBusiness("modal");

    onMounted(async () => {
      const holdBusiness = await businessDetail();

      // business_id.value           = holdBusiness.id
      business.value.companyName = holdBusiness.companyName;
      business.value.companyType = holdBusiness.companyType;
      business.value.businessType = holdBusiness.businessType;
      business.value.currency = holdBusiness.currency;
      business.value.addressLine1 = holdBusiness.addressLine1;
      business.value.addressLine2 = holdBusiness.addressLine2;
      business.value.country = holdBusiness.country;
      business.value.state = holdBusiness.state;
      business.value.city = holdBusiness.city;
      business.value.zipcode = holdBusiness.zipcode;
      business.value.fax = holdBusiness.fax;
      business.value.mobileNumber = holdBusiness.mobileNumber;
      business.value.phoneNumber = holdBusiness.phoneNumber;
      business.value.website = holdBusiness.website;
    });

    return {
      billedCustomer,
      business,
      invoice: props.invoice,
      items: props.items,
      setting: props.setting,
      subTotal: props.subTotal,
      grandTotal: props.grandTotal,
      salesTax: props.salesTax,
      payments: props.payments,
    };
  },
});
</script>

<style type="text/css" scoped>
@import url("https://fonts.googleapis.com/css2?family=Source+Sans+3&display=swap");

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

@media print {
  body {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact !important;
  }
}

@page {
  size: A4 portrait;
  margin-left: 0px;
  margin-right: 0px;
  margin-top: 8px;
  margin-bottom: 0px;
  margin: 0;
  -webkit-print-color-adjust: exact;
}

.invoice-box {
  --primary: v-bind(setting.accent_color);
  --white: #ffffff;
  --black: #000000;
  --textcolor1: v-bind(setting.accent_color);
  --textcolor2: #777777;
  --bordercolor: #aaaaaa;
  --tablebgcolor1: #eeeeee;
  --tablebgcolor2: #dddddd;
  --itemnamecolor: #0a257d;
}

.clearfix:after {
  content: "";
  display: table;
  clear: both;
}

a {
  color: var(--primary);
  text-decoration: none;
}

body {
  position: relative;
  margin: 10px 25px;
  color: var(--textcolor1);
  background: var(--white);
  font-size: 14px;
  font-family: "Source Sans 3", sans-serif;
}

header {
  margin-bottom: 20px;
  border-bottom: 1px solid var(--bordercolor);
}

#logo {
  float: left;
  margin-top: 8px;
}

#logo img {
  height: 65px;
  background-color: var(--primary);
}

#company {
  float: right;
  text-align: right;
}

#details {
  margin-bottom: 30px;
}

#client {
  border-left: 6px solid var(--primary);
  float: left;
}

#client .to {
  color: var(--textcolor2);
}

h2.name {
  font-size: 1.4em;
  font-weight: normal;
  margin: 0;
}

#invoice {
  float: right;
  text-align: right;
}

#invoice h1 {
  color: var(--primary);
  font-size: 2.4em;
  line-height: 1em;
  font-weight: normal;
  margin: 0 0 10px 0;
}

#invoice .date {
  font-size: 1.1em;
  color: var(--textcolor2);
}

table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  margin-bottom: 20px;
}

table.payments-table {
  width: 37%;
  float: left;
  margin-bottom: 90px;
}

table.total-table {
  width: 40%;
  float: right;
}

table th,
table td {
  padding: 20px;
  background: var(--tablebgcolor1);
  text-align: center;
  border-bottom: 1px solid var(--white);
}

table th {
  white-space: nowrap;
  font-weight: normal;
  text-transform: capitalize;
}

table td h3 {
  color: var(--itemnamecolor);
  font-size: 1.2em;
  font-weight: normal;
  margin: 0 0 0.2em 0;
}

table .no {
  color: var(--white);
  font-size: 1.6em;
  background: var(--primary);
  text-align: center;
}

table .desc {
  text-align: left;
}

table .unit {
  background: var(--tablebgcolor2);
}

table .total {
  background: var(--primary);
  color: var(--white);
}

table td.unit,
table td.qty,
table td.total {
  font-size: 1.2em;
}

table tbody tr:last-child td {
  border: none;
}

table tfoot td {
  padding: 10px 20px;
  background: var(--white);
  border-bottom: none;
  font-size: 1.2em;
  white-space: nowrap;
}

table tfoot tr:first-child td {
  border-top: none;
  border-bottom: 1px solid var(--bordercolor);
}

table.total-table tfoot tr:last-child td {
  color: var(--primary);
  font-size: 1.4em;
  border-top: 1px solid var(--primary);
}

table.total-table tfoot tr.tax-info td {
  padding-top: 2px;
  padding-bottom: 2px;
}

table.total-table tfoot tr td:first-child {
  border: none;
}

table.total-table tfoot tr:nth-child(2) td {
  padding-top: 10px;
}

table.total-table tfoot tr:nth-last-child(2) td {
  padding-bottom: 10px;
}

table.payments-table tfoot tr.payments-subheading td {
  border-top: 1px solid var(--bordercolor);
  border-bottom: 1px solid var(--bordercolor);
}

table.payments-table tfoot tr.payments-heading td,
table.payments-table tfoot tr.payments-subheading td,
table.payments-table tfoot tr.payments-info td {
  text-align: left;
}

table.payments-table tfoot tr.payments-subheading td.date-subheading {
  width: 5%;
  padding-top: 6px;
  padding-bottom: 5px;
}

table.payments-table tfoot tr.payments-subheading td.amount-subheading {
  width: 20%;
  padding-top: 6px;
  padding-bottom: 5px;
}

table.payments-table tfoot tr.payments-subheading td.type-subheading {
  width: 68%;
  padding-top: 6px;
  padding-bottom: 5px;
}

table.payments-table tfoot tr.payments-info td.date-info {
  width: 5%;
  font-size: 1.1em;
}

table.payments-table tfoot tr.payments-info td.amount-info {
  width: 20%;
  font-size: 1.1em;
}

table.payments-table tfoot tr.payments-info td.type-info {
  width: 68%;
  font-size: 1.1em;
}

table.payments-table tfoot tr.payments-info td {
  padding-top: 1px;
  padding-bottom: 1px;
}

table.payments-table tfoot tr:nth-child(3) td {
  padding-top: 7px;
}

table.payments-table tfoot tr:last-child td {
  padding-bottom: 7px;
  border-bottom: 1px solid var(--bordercolor);
}

#thanks {
  clear: both;
  font-size: 2em;
  margin-bottom: 20px;
}

#notices {
  clear: both;
  padding-left: 10px;
  border-left: 6px solid var(--primary);
}

#notices .notice {
  font-size: 1.2em;
}

footer {
  color: var(--textcolor2);
  width: 100%;
  border-top: 1px solid var(--bordercolor);
  text-align: center;
  margin-top: 70px;
  margin-bottom: 8px;
}
</style>
