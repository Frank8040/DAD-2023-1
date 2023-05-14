import Product from "./Product";

export async function searchCustomers() {
  let url = process.env.REACT_APP_API + "producto";
  let response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return await response.json();
}

export async function removeCustomer(id: string) {
  let url = process.env.REACT_APP_API + "producto/" + id;
  await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function saveCustomer(product: Product) {
  let url = process.env.REACT_APP_API + "producto";
  await fetch(url, {
    method: "POST",
    body: JSON.stringify(product),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function searchCustomerById(id: string) {
  let url = process.env.REACT_APP_API + "producto/" + id;
  let response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return await response.json();
}
