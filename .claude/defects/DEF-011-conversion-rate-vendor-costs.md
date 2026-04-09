# Defect Ticket — DEF-011 Conversion_rate_vendor_costs

## Description

When entering a cost in the vendor costs table in a currency other than the primary currency the estimator tool:
1) fails to provide a total cost on the vendor cost table 
2) convert from the secondary currency to the primary currency on the Summary Tab

## Page / tab affected

Vendor Costs and Summary Tab

## Screenshots

- DEF-011-conversion-rate-vendor-costs-exchange-rate-settings.png — exchange_rate_settings
- DEF-011-conversion-rate-vendor-costs-vendor-cost-summary-table.png — vendor_cost_summary_table
- DEF-011-conversion-rate-vendor-costs-summary-cost-table.png — Summary_cost_table

## Console errors

none

## Steps to reproduce

1. Add USD as a rate in the Currency Settings
2. Add Vendor Cost in USD. In the screenshot I have input 2 milestones of 5000 USD on two months
3. View the costs in the vendor costs table. Expectation is that the costs would equal 2 milestones * 5000 USD * conversation rate to AUD.
4. View the costs in the Summary Table. Expectation is that this will give 2 milestones * 5000 USD * conversation rate to AUD.
