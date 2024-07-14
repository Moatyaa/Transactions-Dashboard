import React, { useState, useEffect } from "react";
import axios from "axios";
import { useQuery } from "react-query";
import {
  LineChart,
  Line,
  XAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
} from "recharts";

export default function TransactionsTable() {
  const [filteredName, setFilteredName] = useState("");
  const [filteredAmount, setFilteredAmount] = useState("");
  const [searchedNameResult, setSearchedName] = useState([]);
  const [searchedAmountResult, setSearchedAmount] = useState([]);
  const [selectedRowName, setSelectedRowName] = useState(''); 
  const [graphedTransaction, setGraphedTransaction] = useState([]);

  // Fetch customers data with react-query
  const { data: customers } = useQuery("customers", async () => {
    const response = await axios.get("https://transactions-dashboard-xi.vercel.app/customers");
    return response.data;
  });

  // Fetch transactions data with react-query
  const { data: transactions } = useQuery("transactions", async () => {
    const response = await axios.get("https://transactions-dashboard-xi.vercel.app/transactions");
    return response.data;
  });

  // Function to filter customers by name
  function filterCustomersByName(customers, searchedCustomer) {
    if (!searchedCustomer) {
      return customers;
    }

    const normalizedName = searchedCustomer.toLowerCase();
    return customers.filter((customer) =>
      customer.name.toLowerCase().includes(normalizedName)
    );
  }

  // Function to filter transactions by amount
  function filterTransAmount(transactions, searchedTransAmount) {
    if (!searchedTransAmount) {
      return transactions;
    }
    if(searchedTransAmount > 0){
      return transactions.filter(
        (transaction) => transaction.amount >= searchedTransAmount
      );
    }
  }

  // Handle row click to set selected row data
  const handleRowClick = (transactionId, customerName) => {
    setSelectedRowName(customerName);

    if (
      Array.isArray(searchedAmountResult) &&
      searchedAmountResult.length > 0
    ) {
      setGraphedTransaction(
        searchedAmountResult.filter(
          (transaction) => parseInt(transaction.customer_id) === transactionId
        )
      );
    }
  };

  // Effect to update filtered customers when filteredName changes
  useEffect(() => {
    const filteredCustomers = filterCustomersByName(customers, filteredName);
    setSearchedName(filteredCustomers);
  }, [customers, filteredName]);

  // Effect to update filtered transactions when filteredAmount changes
  useEffect(() => {
    const filteredTransactions = filterTransAmount(
      transactions,
      filteredAmount
    );
    setSearchedAmount(filteredTransactions);
  }, [transactions, filteredAmount]);

  return (
    <>
      <div className="row">
        <div className="col-lg-6">
          <div className="p-4 bg-white rounded-1 rounded-top-0 shadow">
            <h2 className="sub-title">Customers</h2>
            <form className="my-2">
              <label htmlFor="filteredName">Filter by Name</label>
              <input
                placeholder="Enter customer name"
                className="w-75 mb-3 d-block rounded-1 p-1 input-border"
                type="text"
                name="filteredName"
                id="filteredName"
                value={filteredName}
                onChange={(e) => {
                  setFilteredName(e.target.value);
                }}
              />
              <label htmlFor="transactionAmount">
                Filter by Transaction Amount
              </label>
              <input
                placeholder="Enter minimum transaction amount"
                className="w-75 rounded-1 d-block p-1 input-border"
                type="number"
                name="transactionAmount"
                id="transactionAmount"
                value={filteredAmount}
                onChange={(e) => {
                  setFilteredAmount(e.target.value);
                }}
              />
            </form>

                <table className="table  mt-4 table-striped">
              <thead>
                <tr className="fs-6">
                  <th scope="">#</th>
                  <th scope="">Customer Name</th>
                  <th scope="">Transaction Amount</th>
                  <th scope="">Transaction Date</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(searchedAmountResult) &&
                searchedAmountResult.length > 0 ? (
                  searchedAmountResult.map((transaction, index) => (
                    <React.Fragment key={transaction.id}>
                      {searchedNameResult?.map((customer) =>  customer.id === transaction.customer_id ?  
                          <React.Fragment key={transaction.id}>
                              <tr
                              className="pointer"
                              key={transaction.id}
                              onClick={() =>
                                handleRowClick(
                                  transaction.customer_id,
                                  customer.name
                                )
                              }
                            >
                              <th scope="row">{index + 1}</th>
                              <td>{customer.name}</td>
                              <td>{transaction.amount}</td>
                              <td>{transaction.date}</td>
                            </tr>
                          </React.Fragment> : ''
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">No data found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="col-lg-6">
            <div className="p-4 bg-white rounded shadow">
              <h2 className="sub-title mb-2">Chart for {selectedRowName}</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={graphedTransaction}
                  margin={{ left: 12, right: 12 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) =>
                      new Date(value).toLocaleString("en-us", {
                        month: "short",
                      })
                    }
                  />
                  <ChartTooltip cursor={false} />
                  <Line
                    dataKey="amount"
                    type="natural"
                    stroke="#8884d8"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          
        </div>
      </div>
    </>
  );
}
