### Setup Locally
To run the `index.js` file, follow these steps:

1. Ensure that Node.js is installed on your system. You can verify this by running `node -v` in your terminal. If Node.js is not installed, download and install it from the official Node.js website.

2. Navigate to the directory containing the `index.js` file using the `cd` command in your terminal.

3. Before running the file, you need to install the necessary dependencies. These are listed in the `package.json` file. If you don't have a `package.json` file, you'll need to create one by running `npm init -y`. Then, install the dependencies by running `npm install`.

4. Now, you can run the `index.js` file by using the command `node index.js`.

Here's how these steps look in command form:

```bash
# Verify Node.js installation
node -v

# Navigate to the directory
cd /path/to/directory

# Install dependencies
npm install

# Run the file
node index.js
```

Please replace `/path/to/directory` with the actual path to your `index.js` file.

### Required External Dependencies
The script interacts with locally deployed canisters. You need to have the following dependencies installed:
1. ICP ledger canister
2. ICP index canister

### Script Sections

1. **GET NAME**: This section calls the `name` function on the `ledger` canister. It retrieves and logs the name of the canister.

2. **GET SUBACCOUNT-ID**: This section creates an account object with a specific owner and subaccount, then calls the `account_identifier` function on the `ledger` canister. It retrieves and logs the account identifier.

3. **GET BALANCE (PRINCIPAL)**: This section creates an account object with a specific owner and no subaccount, then calls the `icrc1_balance_of` function on the `ledger` canister. It retrieves and logs the balance of the account.

4. **TRANSFER ICP**: This section creates a transfer object with specific parameters, then calls the `icrc1_transfer` function on the `ledger` canister. It initiates a transfer of ICP tokens and logs the result.

5. **BALANCE OF SUBACCOUNT**: This section creates an account object with a specific owner and subaccount, then calls the `icrc1_balance_of` function on the `ledger` canister. It retrieves and logs the balance of the subaccount.

6. **GET TXS**: This section creates a transaction query object with specific parameters, then calls the `get_account_transactions` function on the `index` canister. It retrieves and logs the transactions of the account.

7. **GET BLOCK**: This section creates a block query object with specific parameters, then calls the `query_blocks` function on the `ledger` canister. It retrieves and logs the queried blocks.