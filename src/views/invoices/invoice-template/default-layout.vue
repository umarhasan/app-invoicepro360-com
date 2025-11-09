<template>
<div class="invoice-box box">
  <table class="top">
    <tbody>
      <tr>
        <td class="title" width="60%">
          <img :src="setting.logo" v-if="setting.logo" class="w-32"/>
          <p class="subheading" v-if="invoice.invoiceSummary">{{invoice.invoiceSummary}}</p>
          <p class="user-name">{{business.addressLine1}}  <br />
              {{business.phoneNumber}}
          </p>
        </td>
        <td class="text-end" valign="middle">
          <div class="flex justify-end items-center">
            <table class="top-right" width="70%">
              <tbody>
                <tr>
                  <td class="text-right"> Quotation Number: </td>
                  <td class="text-right">{{invoice.referenceNumber}} - {{invoice.invoiceNumber}}</td>
                </tr>

                <tr>
                  <td class="text-right"> Expiration Date: </td>
                  <td class="text-right">{{$h.formatDate(invoice.invoiceDate)}}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </td>
      </tr>
    </tbody>
    </table>
    <div style="height:30px"></div>

    <table>
      <tbody>
      <tr class="bg-gray-600 text-white">
        <td class="company-name" colspan="4">
          <div class="section-heading">{{business.companyName}} Information
          </div>
        </td>
      </tr>
      <tr>
        <td width="15%"><span class="h-label">Account Executive</span></td>
        <td>34329 Arkansas Lane</td>
        <td><span class="h-label">Invoice Date:</span></td>
        <td>{{$h.formatDate(invoice.invoiceDate)}}</td>
      </tr>

      <tr>
        <td></td>
        <td>company@companyltd.com</td>
        <td><span class="h-label">Due Date:</span> </td>
        <td>{{$h.formatDate(invoice.paymentDueDate)}}</td>
      </tr>

      <tr>
        <td colspan="4">
          <div style="height:20px"></div>
        </td>
      </tr>

      <tr class="bg-gray-600 text-white">
        <td class="company-name" colspan="4">
          <div class="section-heading">Address Information</div>
        </td>
      </tr>

      <tr>
        <td width="15%"><span class="h-label">Bill To</span></td>

        <td>
          <!-- <h2 class="name">{{ billedCustomer.customer}}</h2> -->
          <p>{{billedCustomer.firstName + ' ' + billedCustomer.lastName }}</p>
            <p>{{billedCustomer.billingAddressLine1}}</p>
            <p>{{billedCustomer.billingAddressLine2}}</p>
            <p>
              {{billedCustomer.billingCity}}, {{billedCustomer.billingState}} {{billedCustomer.billingZipcode}}
            </p>
            <p>{{billedCustomer.billingCountry}}</p>
            <br>
            <p class="info-text">{{billedCustomer.email}}</p>
            <p class="info-text">{{billedCustomer.phoneNumber ?? billedCustomer.mobileNumber}}</p>
        </td>

        <td width="15%"><span class="h-label">Ship To</span></td>

        <td>
          <h2 class="name"><strong>{{ billedCustomer.shippingName ?? billedCustomer.customer}}</strong></h2>

          <p>{{billedCustomer.shippingAddressLine1}}</p>
          <p>{{billedCustomer.shippingAddressLine2}}</p>
          <p>
            {{billedCustomer.shippingCity}}, {{billedCustomer.shippingState}} {{billedCustomer.shippingZipcode}}
          </p>
          <p>{{billedCustomer.shippingCountry}}</p>
          <br>
          <p class="info-text">{{billedCustomer.shippingPhoneNumber ?? billedCustomer.phoneNumber}}</p>
        </td>
      </tr>

      <tr>
        <td colspan="4">
          <div style="height:20px"></div>
        </td>
      </tr>
    </tbody>
      
    </table>

    <!-- <table>
      <tr>
        <td>
          <div class="flex justify-end">
            <table class="top-right">
              <tr>
                <td class="text-right"> Quotation Number: </td>
                <td class="text-left">{{invoice.referenceNumber}}</td>
              </tr>

              <tr>
                <td class="text-right"> Expiration Date: </td>
                <td class="text-left">{{$h.formatDate(invoice.invoiceDate)}}</td>
              </tr>
            </table>
          </div>
        </td>
      </tr>
    </table> -->

    <table class="items-table">
    <tbody>
      <tr class="heading bg-gray-600 capitalize">
        <th class="num-col">#</th>
        <th class="item-col">
        {{ 
          setting.invoice_columns.items.name == 'others' ?
          setting.invoice_columns.items.value :
          setting.invoice_columns.items.name 
        }}
        </th>
        <th class="quantity-col" v-if="!setting.invoice_columns.units.hide">            
          {{ 
            setting.invoice_columns.units.name == 'others' ?
            setting.invoice_columns.units.value :
            setting.invoice_columns.units.name 
          }}
        </th>
        <th class="price-col" v-if="!setting.invoice_columns.price.hide">
          {{ 
            setting.invoice_columns.price.name == 'others' ?
            setting.invoice_columns.price.value :
            setting.invoice_columns.price.name 
          }}
        </th>
        <th class="tax-col" v-if="!setting.invoice_columns.taxable.hide">
          {{ 
            setting.invoice_columns.taxable.name == 'others' ?
            setting.invoice_columns.taxable.value :
            setting.invoice_columns.taxable.name 
          }}
        </th>
        <th class="total-col" v-if="!setting.invoice_columns.amount.hide">
          {{ 
            setting.invoice_columns.amount.name == 'others' ?
            setting.invoice_columns.amount.value :
            setting.invoice_columns.amount.name 
          }}
        </th>
      </tr>
      
      <tr class="item" v-for="(item,index) in items" :key="index">
        <td class="num-col">{{ index + 1  }}</td>
        <td class="item-col">
          <p>{{item.name}}</p>
          <p class="description" v-if="!setting.invoice_columns.items.hide">
            {{item.description}}
          </p>
        </td>
        <td class="quantity-col" v-if="!setting.invoice_columns.units.hide">
          {{item.quantity}}
        </td>
        <td 
          class="price-col font-semibold" 
          v-html="$h.formatCurrency(item.price)"
          v-if="!setting.invoice_columns.price.hide"></td>
        <td class="tax-col" v-if="!setting.invoice_columns.taxable.hide">
          {{ (item.isTaxable) ? 'Yes' : 'No' }}
        </td>
        <td 
        class="total-col" 
        v-html="$h.formatCurrency(item.total)"
        v-if="!setting.invoice_columns.amount.hide"></td>
      </tr>
    </tbody>  
    </table>

    <table class="notes-terms" width="50%">
      <tbody>
        <tr class="notice">
        <td colspan="6">
          <table>
          <tbody>
            <tr>
              <td>
                <p class="notice-heading">Note / Terms</p>
              </td>
            </tr>
            <tr>
              <td>
                <p class="notice-text">{{invoice.notes}}</p>
              </td>
            </tr>
          </tbody>
          </table>
        </td>
      </tr>
      </tbody>
    </table>




    <table class="payments-table hidden">
      <tbody>
        <tr class="payments">
          <td class="payments-heading">Payments</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>

        <tr class="sub-payments">
          <td class="sub-payments-heading pay-date">Date</td>
          <td class="sub-payments-heading pay-amount">Amount</td>
          <td class="sub-payments-heading pay-type">Type</td>
          <td></td>
          <td></td>
        </tr>

        <tr class="pay-info-row" v-for="(payment, index) in payments"
        :key="index">
          <td>
            <p class="pay-info">{{ $h.formatDate(payment.paymentDate) }}</p>
          </td>
          <td>
            <p class="pay-info" style="text-align: left;" v-html="$h.formatCurrency(payment.amount)"></p>
          </td>
          <td>
            <p class="pay-info">{{ payment.paymentMethod }}</p>
          </td>
          <td></td>
          <td></td>
        </tr>
      </tbody>
    </table>

    <table class="total-table">
      <tbody>
      <tr class="subtotal">
        <td class="h-label" style="width: 50%;">Subtotal:</td>
        <td class="subtotal-amount" style="width: 20%;" v-html="$h.formatCurrency(subTotal)"></td>
      </tr>


      <tr class="tax" v-for="tax in salesTax" :key="tax.id">
        <td style="width: 50%;">
          <p class="h-label">{{tax.taxAbbreviation}} {{tax.taxRate}}%:</p>
        </td>
        <td style="width: 20%;">
          <p class="tax-amount" v-html="$h.formatCurrency(tax.taxAmount)"></p>
        </td>
      </tr>

      <tr class="total">
        <td class="h-label">Total: </td>
        <td class="total-amount" v-html="$h.formatCurrency(grandTotal)"></td>
      </tr>

      <tr class="grandtotal">
        <td class="h-label" style="width: 50%;">Amount Due: </td>
        <td class="grandtotal-amount" v-html="$h.formatCurrency(invoice.dueAmount)"></td>
      </tr>
    </tbody>
    </table>


    <table>
      <tbody>

      <tr class="footer">
        <td colspan="6">
          <table>
          <tbody>
            <tr>
              <td>
                <p class="footer-text">{{invoice.footerNotes}}</p>
              </td>
            </tr>
          </tbody>
          </table>
        </td>
      </tr>
    </tbody>
    </table>
  </div>

</template>

<script>
import { defineComponent, onMounted, ref, watchEffect } from "vue";
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

    //console.log(props.setting.accent_color)

    return {
        billedCustomer,
        business, 
        salesTax :props.salesTax,
        invoice : props.invoice,
        items   : props.items,
        setting : props.setting,
        subTotal: props.subTotal,
        grandTotal: props.grandTotal,
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

.invoice-box {
  --primary: v-bind(setting.accent_color);
  --white: rgb(255, 255, 255);
  --black: rgb(0, 0, 0);
  --infocolor: rgb(22, 22, 22);
  --textcolor1: #777;
  --textcolor2: #555;
  --bordercolor: #e2e2e2;
}

body {
  /* font-family: 'Poppins', sans-serif; */
  /* font-family: "Source Sans 3", sans-serif; */
  /* font-family: "Roboto", sans-serif; */
  text-align: center;
  color: var(--textcolor1);
}

.invoice-box {
  max-width: 100%;
  margin: auto;
  padding: 30px;
  font-size: 16px;
  line-height: 24px;
  color: var(--textcolor2);
}

.invoice-box table {
  width: 100%;
  line-height: inherit;
  text-align: left;
  border-collapse: collapse;
}

.invoice-box table.payments-table {
  width: 50%;
  float: left;
}

.invoice-box table td {
  padding: 5px;
  vertical-align: top;
}

.invoice-box table td img.logo {
  width: 100%;
  max-width: 210px;
}

.invoice-box table td p.heading {
  font-weight: bold;
}

.invoice-box table td p.subheading {
  font-size: 0.9rem;
  margin-bottom: 20px;
}

.invoice-box table td p.company-name {
  /* color: var(--primary); */
  line-height: 22px;
}

.invoice-box table td p.user-name {
  line-height: 20px;
}

.invoice-box table tr.top table td {
  padding-bottom: 20px;
}

.invoice-box table tr.information table td {
  padding-bottom: 40px;
}

.invoice-box table tr.information table td p.client-info-text {
  color: var(--infocolor);
  font-size: 0.93rem;
  line-height: 21px;
}

.invoice-box table tr.information table td.invoice-info {
  text-align: right;
  line-height: 21px;
}

.invoice-box table tr.information table td p.invoice-info-heading {
  color: var(--infocolor);
  font-weight: 400;
  font-size: 0.93rem;
}

.invoice-box
  table
  tr.information
  table
  td
  p.invoice-info-heading
  span.invoice-info-text {
  color: var(--textcolor2);
  font-size: 0.93rem;
}

.invoice-box table tr.heading td {
  font-weight: bold;
  color: var(--white);
  font-size: 15px;
}

.invoice-box table tr.details td {
  padding-bottom: 20px;
}

/* .invoice-box table tr.item td {
  border-bottom: 1px solid var(--bordercolor);
  font-size: 15px;
  padding-top: 13px;
  padding-bottom: 12px;
}

.invoice-box table tr.item td.item-col p.description {
  font-size: 13px;
  margin-top: -1px;
  color: var(--textcolor1);
} */

.invoice-box table tr.payments td {
  padding-top: 20px;
  padding-bottom: 10px;
}

.invoice-box table tr.payments td.payments-heading {
  font-weight: 600;
  margin-bottom: 4px;
}

.invoice-box table tr.sub-payments td.sub-payments-heading {
  border-top: 1px solid var(--bordercolor);
  padding-top: 10px;
  padding-bottom: 8px;
  font-weight: 600;
  line-height: 20px;
}

.invoice-box table tr.sub-payments td.pay-date {
  width: 25%;
}

.invoice-box table tr.sub-payments td.pay-amount {
  width: 25%;
  text-align: left;
}

.invoice-box table tr.sub-payments td.pay-type {
  width: 50%;
}

.invoice-box table tr.pay-info-row td {
  padding-top: 10px;
  padding-bottom: 10px;
}

.invoice-box table tr.pay-info-row td:nth-child(-n + 3) {
  border-top: 1px solid var(--bordercolor);
  border-bottom: 1px solid var(--bordercolor);
}

.invoice-box table tr.pay-info-row td.pay-info {
  font-size: 13.5px;
  line-height: 21px;
}

.invoice-box table tr.subtotal td {
  padding-top: 20px;
  padding-bottom: 10px;
}

.invoice-box table tr.subtotal td.subtotal-heading {
  margin-bottom: 4px;
  border-bottom: 1px solid var(--bordercolor);
}

.invoice-box table tr.subtotal td.subtotal-amount {
  margin-bottom: 4px;
  text-align: right;
}

.invoice-box table tr.tax td {
  padding-top: 2px;
  padding-bottom: 2px;
}

.invoice-box table.total-table tr:nth-child(2) td {
  padding-top: 10px;
}

.invoice-box table.total-table tr:nth-last-child(3) td {
  padding-bottom: 10px;
}

.invoice-box table tr.tax td p.tax-heading {
  font-size: 13.5px;
  line-height: 21px;
}

.invoice-box table tr.tax td p.tax-amount {
  text-align: right;
  line-height: 21px;
}

.invoice-box table tr.total td.total-heading {
  border-top: 1px solid var(--bordercolor);
  padding-top: 10px;
  padding-bottom: 8px;
  font-weight: 600;
  width: 50%;
  line-height: 20px;
}

.invoice-box table tr.total td.total-amount {
  border-top: 1px solid var(--bordercolor);
  padding-top: 10px;
  padding-bottom: 8px;
  text-align: right;
  width: 20%;
  line-height: 20px;
}

.invoice-box table tr.grandtotal td:last-child,
.invoice-box table tr.grandtotal td:nth-last-child(2) {
  font-weight: 600;
  border-top: 1px solid var(--bordercolor);
  padding-top: 15px;
}

.invoice-box table tr.grandtotal td.grandtotal-amount {
  text-align: right;
  width: 20%;
}

.invoice-box table tr td.num-col {
  width: 5%;
  text-align: center;
}

.invoice-box table tr td.item-col {
  padding-left: 10px;
  width: 50%;
  text-align: left;
  line-height: 19px;
}

.invoice-box table tr td.quantity-col {
  text-align: right;
  width: 11%;
}

.invoice-box table tr td.price-col {
  text-align: right;
  width: 12%;
}

.invoice-box table tr td.tax-col {
  text-align: right;
  width: 10%;
}

.invoice-box table tr.item td.tax-col {
  padding-right: 15px;
}

.invoice-box table tr td.total-col {
  text-align: right;
  padding-right: 10px;
  width: 17%;
}

.invoice-box table tr.notice > td:first-child {
  padding-top: 30px;
}

.invoice-box table tr.notice td table tr td p.notice-heading {
  font-size: 0.91rem;
  text-decoration: underline;
  color: var(--black);
}

.invoice-box table tr.notice td table tr td p.notice-text {
  font-size: 0.9rem;
  position: relative;
  top: -8px;
}

.invoice-box table tr.footer > td:first-child {
  padding-top: 30px;
}

.invoice-box table tr.footer td table tr td p.footer-text {
  text-align: center;
  font-size: 0.85rem;
}

.invoice-box .top-right{
  width:60%;
  text-align: left;
}
.invoice-box .top-right td{
  padding:0.2rem 0.1rem;
  font-size:0.95rem;
}

/* ============== AHP ============== */

.items-table{
    @apply w-full text-sm text-gray-700;
  }

  .items-table th, .items-table td{
    @apply border dark:border-dark-3;
    border-color:#f3f1f1;
  }
  
  .items-table th{
    @apply bg-gray-600 dark:bg-dark-3 px-2 py-2 text-white dark:text-theme-3 border-gray-600;
  }
  .items-table td {
    @apply px-4 py-2 border-gray-200;
  }

  .items-table th.action-col{
    @apply border-l-0;
  }

  .section-heading{
    @apply py-1 font-semibold
  }
  .h-label{
    @apply font-semibold
  }

  .total-table{
    width:35% !important;
    float:right;
  }
  .total-table tr{
    @apply border-b border-gray-200
  }

</style>