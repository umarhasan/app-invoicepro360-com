<template>
<div class="main-box box">
  <header>
    <div id="box1">
      <div class="heading-box1" >
        <!-- Without logo -->
        <div v-if="!setting.logo">
          <h1>{{(invoice.invoiceTitle)?invoice.invoiceTitle: 'invoice'}}</h1>
          <h3 v-if="invoice.invoiceSummary">{{invoice.invoiceSummary}}</h3>
        </div>
        <img :src="setting.logo" v-if="setting.logo" class="w-32 logo" alt="Company logo"/>
      </div>
    </div>

    <div id="box2">
      <div class="heading-box2">
        <h3>Amount Due</h3>
        <h1 v-html="$h.formatCurrency(invoice.dueAmount)"></h1>
      </div>
    </div>
  </header>

  <main>
    <div class="info-box">
      <div class="info-box1">
        <div style="width: 55%; margin-right: 20px;">
          <div>
            <p class="info-heading">Billed To</p>
            <h2 class="name"><strong>{{billedCustomer.customer}}</strong></h2>
            <p class="info-text">{{billedCustomer.firstName + ' ' + billedCustomer.lastName}}</p>           
            <p class="info-text">{{billedCustomer.billingAddressLine1}}</p>
            <p class="info-text">{{billedCustomer.billingAddressLine2}}</p>            
            <p class="info-text">{{billedCustomer.billingCity}}, {{billedCustomer.billingState}} {{billedCustomer.billingZipcode}}</p>
            <p class="info-text">{{billedCustomer.billingCountry}}</p> <br />
            <p class="info-text">{{billedCustomer.email}}</p>
            <p class="info-text">{{billedCustomer.phoneNumber ?? billedCustomer.mobileNumber}}</p>
          </div>
           
        </div>
      
        <div style="width: 45%;">
          <p class="info-heading">SHIP TO</p>
          <h2 class="name"><strong>{{ billedCustomer.shippingName ?? billedCustomer.customer}}</strong></h2>
          <p class="info-text">{{billedCustomer.shippingAddressLine1}}</p>
          <p class="info-text">{{billedCustomer.shippingAddressLine2}}</p>
          <p class="info-text">
            {{billedCustomer.shippingCity}}, {{billedCustomer.shippingState}} {{billedCustomer.shippingZipcode}}
          </p>
          <p class="info-text">{{billedCustomer.shippingCountry}}</p>
          <br>
          <p class="info-text">{{billedCustomer.shippingPhoneNumber ?? billedCustomer.phoneNumber}}</p>
        </div>
      </div>

      <div class="info-box2">
        <!-- With logo -->
        <div class="invoice-heading" v-if="setting.logo">
          <h1>{{(invoice.invoiceTitle)?invoice.invoiceTitle: 'invoice'}}</h1>
          <h3 v-if="invoice.invoiceSummary">{{invoice.invoiceSummary}}</h3>
        </div>


        <p class="info-text">
          <span class="bold">Invoice #: </span>{{invoice.invoiceNumber}}
        </p>
        <p class="info-text">
          <span class="bold">Reference #: </span>{{invoice.referenceNumber}}
        </p>

        <p class="info-text">
          <span class="bold">Invoice Date: </span>{{$h.formatDate(invoice.invoiceDate)}}
        </p>
        <p class="info-text">
          <span class="bold">Payment Due: </span>{{$h.formatDate(invoice.paymentDueDate)}}
        </p>
      </div>
    </div>

    <div class="invoice-box">
      <table>
        <thead>
          <tr class="uppercase">
            <th class="service"> 
                {{ 
                    setting.invoice_columns.items.name == 'others' ?
                    setting.invoice_columns.items.value :
                    setting.invoice_columns.items.name 
                }}
            </th>
            <th class="desc" v-if="!setting.invoice_columns.items.hide">DESCRIPTION</th>
            <th v-if="!setting.invoice_columns.units.hide">
                {{ 
                    setting.invoice_columns.units.name == 'others' ?
                    setting.invoice_columns.units.value :
                    setting.invoice_columns.units.name 
                }}
            </th>
            <th v-if="!setting.invoice_columns.price.hide">
                {{ 
                    setting.invoice_columns.price.name == 'others' ?
                    setting.invoice_columns.price.value :
                    setting.invoice_columns.price.name 
                }}
            </th>
            <th v-if="!setting.invoice_columns.taxable.hide">
                {{ 
                    setting.invoice_columns.taxable.name == 'others' ?
                    setting.invoice_columns.taxable.value :
                    setting.invoice_columns.taxable.name 
                }}
            </th>
            <th v-if="!setting.invoice_columns.amount.hide">
                {{ 
                    setting.invoice_columns.amount.name == 'others' ?
                    setting.invoice_columns.amount.value :
                    setting.invoice_columns.amount.name 
                }}
              </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item,index) in items" :key="index">
            <td class="service">{{item.name}}</td>
            <td class="desc" v-if="!setting.invoice_columns.items.hide">
              {{item.description}}
            </td>
            <td class="qty" v-if="!setting.invoice_columns.units.hide">
            {{item.quantity}}
            </td>
            <td class="unit" v-if="!setting.invoice_columns.price.hide" 
              v-html="$h.formatCurrency(item.price)"></td>
            <td class="tax" v-if="!setting.invoice_columns.taxable.hide">
              {{ (item.isTaxable) ? 'YES' : 'NO' }}
            </td>
            <td class="total" v-if="!setting.invoice_columns.amount.hide"
            v-html="$h.formatCurrency(item.total)"></td>
          </tr>
        </tbody>
      </table>

      <table class="payments-table">
        <tfoot>
          <tr class="payments">
            <td class="payments-heading" colspan="3">Payments</td>
        </tr>

        <tr class="sub-payments">
          <td class="sub-payments-heading pay-date">Date</td>
          <td class="sub-payments-heading pay-amount">Amount</td>
          <td class="sub-payments-heading pay-type">Type</td>
        </tr>

          <tr class="payments-info" v-for="(payment, index) in payments"
      :key="index">
        <td>
          <p >{{ $h.formatDate(payment.paymentDate) }}</p>
        </td>
        <td>
          <p style="text-align: left;" v-html="$h.formatCurrency(payment.amount)"></p>
        </td>
        <td>
          <p >{{ payment.paymentMethod }}</p>
        </td>

      </tr>

        </tfoot>
      </table>

      <table class="total-table">
        <tfoot>
          <tr class="subtotal-row">
            <td colspan="3" class="subtotal-heading">Subtotal:</td>
            <td class="subtotal-amount total" v-html="$h.formatCurrency(subTotal)"></td>
          </tr>

          <tr class="total-row tax-row" v-for="tax in salesTax" :key="tax.id">
            <td colspan="3" class="tax-heading">{{tax.taxAbbreviation}} {{tax.taxRate}}%:</td>
            <td class="total subtotal-amount" v-html="$h.formatCurrency(tax.taxAmount)"></td>
          </tr>

          <tr class="total-row">
            <td colspan="3" class="total-heading">Total:</td>
            <td class="total" v-html="$h.formatCurrency(grandTotal)"></td>
          </tr>
          <tr class="amountdue-row">
            <td colspan="3" class="grand">Amount Due:</td>
            <td class="grand total" v-html="$h.formatCurrency(invoice.dueAmount)"></td>
          </tr>
        </tfoot>
      </table>
    </div>

    <div id="notice">
      <p class="notice-heading">Notes</p>
      <p class="notice-text">{{ invoice.notes }}</p>
    </div>

    <div class="text-center">
      {{invoice.footerNotes}}
    </div>
  </main>

  <footer>
    <div class="footer">
      <div class="footer-box-1"></div>

      <div class="footer-box-2">
        <div>
          <p class="bold">{{business.companyName}}</p>
          <p>{{business.addressLine1}} {{business.addressLine2}}</p>
          <p>{{business.city}}, {{business.state}}, {{business.zipcode}}</p>
        </div>
      </div>

      <div class="footer-box-3">
        <div>
          <p class="bold">Contact Information</p>
          <p>{{business.phoneNumber}}</p>
          <p>{{business.website}}</p>
        </div>
      </div>
    </div>
  </footer>
    
  </div>

</template>

<script>
import { defineComponent, onMounted } from "vue";
import { useCustomer } from "@/compositions/invoices/customer";
import { saveBusiness,businessDetail } from "@/compositions/business"

export default defineComponent({    
  props : ['invoice','items','setting','subTotal','grandTotal','salesTax','payments'],
  setup(props){

    const { billedCustomer } = useCustomer()
    const { business } = saveBusiness('modal')

    onMounted(async () => {

      const holdBusiness = await businessDetail()

      // business_id.value           = holdBusiness.id
      business.value.companyName  = holdBusiness.companyName
      business.value.companyType  = holdBusiness.companyType
      business.value.businessType = holdBusiness.businessType
      business.value.currency     = holdBusiness.currency
      business.value.addressLine1 = holdBusiness.addressLine1
      business.value.addressLine2 = holdBusiness.addressLine2
      business.value.country      = holdBusiness.country
      business.value.state        = holdBusiness.state
      business.value.city         = holdBusiness.city
      business.value.zipcode      = holdBusiness.zipcode
      business.value.fax          = holdBusiness.fax
      business.value.mobileNumber = holdBusiness.mobileNumber
      business.value.phoneNumber  = holdBusiness.phoneNumber
      business.value.website      = holdBusiness.website        

    })      

    return {
        billedCustomer,
        business, 
        invoice : props.invoice,
        items   : props.items,
        setting : props.setting,
        subTotal: props.subTotal,
        grandTotal: props.grandTotal,
        salesTax: props.salesTax,
        payments : props.payments
    }
  }
})
</script>

<style type="text/css" scoped>
      @import url("https://fonts.googleapis.com/css2?family=Roboto&display=swap");
      @import url("https://fonts.googleapis.com/css2?family=Poppins&display=swap");
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

      .main-box {
        --primary: v-bind(setting.accent_color);
        --secondary: v-bind(setting.accent_color);
        --white: rgb(255, 255, 255);
        --black: rgb(0, 0, 0);
        --gray: #6e6e6e;
        --textcolor: #555555;
        --infotextcolor: #3d3d3d;
        --itembackgroundcolor: #f5f5f5;
        --lightbordercolor: #c1ced9;
        --darkbordercolor: #979ea4;
      }

      body {
        position: relative;
        margin: 0 auto;
        color: var(--textcolor);
        background: var(--white);
        font-size: 14px;
        /* font-family: "Poppins", sans-serif; */
        /* font-family: "Roboto", sans-serif; */
        font-family: "Source Sans 3", sans-serif;
      }

      .bold {
        font-weight: 600;
      }

      header {
        width: 100%;
        height: 120px;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
      }

      header #box1 {
        width: 90%;
        height: 100%;
        background-color: var(--secondary);
        display: flex;
        justify-content: flex-start;
        align-items: center;
      }

      header #box2 {
        width: 10%;
        height: 100%;
        background-color: var(--primary);
        display: flex;
        justify-content: center;
        align-items: center;
      }

      header #box1 .heading-box1 {
        width: 70%;
        text-align: left;
        margin-left: 50px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      }

      header #box1 .heading-box1 h1 {
        font-size: 2rem;
      }

      header #box1 .heading-box1 h3 {
        color: var(--gray);
        font-weight: 500;
      }

      header #box1 .heading-box1 img.logo {
        width: 100%;
        max-width: 170px;
        background-color: var(--primary);
      }

      header #box2 .heading-box2 {
        text-align: center;
      }

      header #box2 .heading-box2 h1 {
        font-size: 1.8rem;
        color: var(--white);
      }

      header #box2 .heading-box2 h3 {
        color: var(--white);
        font-weight: 500;
      }

      main .info-box {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 25px;
      }

      .info-box .info-box1 {
        width: 55%;
        padding-left: 50px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      }

      .info-box .info-box2 {
        width: 45%;
        text-align: right;
        padding-right: 50px;
        line-height: 1.5rem;
      }

      .info-box .info-box2 .invoice-heading {
        margin-bottom: 23px;
      }

      .info-box .info-box2 .invoice-heading h1 {
        font-size: 1.65rem;
      }

      .info-box .info-box2 .invoice-heading h3 {
        color: var(--gray);
        font-weight: 500;
      }

      .info-heading {
        margin-bottom: 7px;
        font-size: 16px;
      }

      .info-text {
        color: var(--infotextcolor);
        font-size: 15px;
      }

      .invoice-box {
        margin: 40px 0px 250px 0px;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        border-spacing: 0;
      }

      table.payments-table {
        width: 49%;
        float: left;
        margin-bottom: 40px;
      }

      table.total-table {
        width: 35%;
        float: right;
      }

      table tbody tr:nth-child(2n-1) td {
        background: var(--itembackgroundcolor);
      }

      table th,
      table td {
        text-align: center;
      }

      table th {
        padding: 5px 20px;
        color: #5d6975;
        border-bottom: 1px solid var(--lightbordercolor);
        white-space: nowrap;
        font-weight: bold;
      }

      table .service,
      table .desc {
        text-align: left;
      }

      table .service {
        padding-left: 50px;
      }

      table .total {
        padding-right: 50px;
      }

      table td {
        padding: 20px;
        text-align: right;
      }

      table td.service,
      table td.desc {
        vertical-align: top;
      }

      table td.unit,
      table td.qty,
      table td.tax,
      table td.total {
        font-size: 1.2em;
      }

      table td.grand {
        border-top: 1px solid var(--lightbordercolor);
        font-size: 1.2em;
        font-weight: 600;
      }

      table td.qty {
        text-align: center;
      }

      table.payments-table tfoot tr.payments-heading td p {
        font-size: 1.1em;
        font-weight: 600;
        text-align: center;
        position: relative;
        left: 8px;
      }

      table.payments-table tfoot tr.payments-subheadings td {

        border-bottom: 1px solid var(--lightbordercolor);
        padding-top: 10px;
        padding-bottom: 8px;
        font-size: 1.1em;
        font-weight: 600;
        line-height: 20px;
        width: 20%;
        text-align: left;
      }

      table.payments-table tfoot tr.payments-subheadings td:first-child {
        text-align: center;
      }

      table.payments-table tfoot tr.payments-subheadings td:last-child {
        width: 60%;
      }

      table.payments-table tfoot tr.payments-info {
        border-top: 1px solid var(--lightbordercolor);
        border-bottom: 1px solid var(--lightbordercolor);
      }

      table.payments-table tfoot tr.payments-info td {
        padding-top: 10px;
        padding-bottom: 5px;
        width: 20%;
      }

      table.payments-table tfoot tr.payments-info td:last-child {
        width: 60%;
      }

      table.payments-table tfoot tr.payments-info td {
        font-size: 1em;
        line-height: 21px;
        text-align: left;
      }

      table.payments-table tfoot tr.payments-info td:first-child {
        text-align: center;
      }


      table tfoot tr.subtotal-row td:last-child,
      table tfoot tr.subtotal-row td:nth-last-child(2) {
        border-bottom: 1px solid var(--lightbordercolor);
        padding-top: 22px;
        padding-bottom: 10px;
      }

      table tfoot tr.subtotal-row td.subtotal-heading {
        font-size: 1.1em;
        font-weight: 600;
        margin-bottom: 6px;
      }

      table tfoot tr.total-row td.tax-heading {
        font-size: 1.1em;
      }

      table tfoot tr.subtotal-row td.subtotal-amount {
        margin-bottom: 6px;
      }

      table tfoot tr.total-row td.total-heading {
        font-size: 1.1em;
        font-weight: 600;
      }

      table.total-table tfoot tr:nth-last-child(2) td:last-child,
      table.total-table tfoot tr:nth-last-child(2) td:nth-last-child(2) {
        border-top: 1px solid var(--lightbordercolor);
      }

      table tfoot tr.total-row td:last-child,
      table tfoot tr.total-row td:nth-last-child(2) {
        padding-top: 12px;
        padding-bottom: 8px;
      }

      table.total-table tfoot tr.tax-row td {
        padding-top: 1px;
        padding-bottom: 1px;
      }

      table.total-table tfoot tr:nth-child(2) td {
        padding-top: 8px;
      }

      table.total-table tfoot tr:nth-last-child(3) td {
        padding-bottom: 8px;
      }

      table tfoot tr.amountdue-row td:nth-last-child(2) {
        font-size: 1.1em;
      }

      table tfoot tr.payments td.payments-heading {
        font-size: 1.1em;
        font-weight: 600;
        margin-bottom: 4px;
        text-align: left;
      }

      table tfoot tr.sub-payments td.sub-payments-heading {
        border-top: 1px solid var(--lightbordercolor);
        padding-top: 10px;
        padding-bottom: 8px;
        font-size: 1.1em;
        font-weight: 600;
        line-height: 20px;
      }

      table tfoot tr.sub-payments td.pay-date {
        width: 25%;
        text-align: center;
      }

      table tfoot tr.sub-payments td.pay-amount {
        width: 25%;
        text-align: left;
      }

      table tfoot tr.sub-payments td.pay-type {
        width: 50%;
        text-align: left;
      }

      table tfoot tr.pay-info-row td {
        padding-top: 10px;
        padding-bottom: 10px;
      }

      table tfoot tr.pay-info-row td:nth-child(-n + 3) {
        border-top: 1px solid var(--lightbordercolor);
        border-bottom: 1px solid var(--lightbordercolor);
      }

      table tfoot tr.pay-info-row td p.pay-info {
        font-size: 1em;
        line-height: 21px;
        text-align: left;
      }

      #notice {
        clear: both;
        margin-left: 50px;
        margin-right: 50px;
      }

      #notice .notice-heading {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 3px;
        text-decoration: underline;
      }

      #notice .notice-text {
        font-size: 15px;
      }

      .footer {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        border-top: 1px solid var(--lightbordercolor);
        margin-top: 30px;
        margin-bottom: 10px;
        padding-top: 20px;
        padding-bottom: 18px;
      }

      .footer-box-1 {
        width: 33%;
      }

      .footer-box-2 {
        width: 33%;
        display: flex;
        justify-content: center;
      }

      .footer-box-3 {
        width: 33%;
        text-align: right;
        display: flex;
        justify-content: flex-end;
        padding-right: 50px;
      }

</style>