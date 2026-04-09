# Defect Ticket — DEF-010 Conversation_rates_tools

## Description

When you add a tool cost in USD it fails to correctly calculate the total cost in USD then convert to AUD.

## Page / tab affected

Tools Tab

## Screenshots

- DEF-010-conversation-rates-tools-table-output.png — Table_Output
- DEF-010-conversation-rates-tools-conversion-rate-entered-in-currency-settings.png — conversion_rate_entered_in_currency_settings

## Console errors

none

## Steps to reproduce

1. Add USD as a rate in the Currency Settings
2. Add Tool Cost in USD. In the screenshot I have input a 1-time cost of 10 units at 12 dollars
3. View the costs in the tools table. Expectation is that the costs would equal (frequency of 1 * 10 units * 12 USD * conversion rate to AUD).
