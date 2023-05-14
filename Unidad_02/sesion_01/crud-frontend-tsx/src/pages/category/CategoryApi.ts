import Category from "./Category";

export async function searchCustomers() {
  let url = process.env.REACT_APP_API + "categoria";
  let response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return await response.json();
}

export async function removeCustomer(id: string) {
  let url = process.env.REACT_APP_API + "categoria/" + id;
  await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function saveCustomer(category: Category) {
  let url = process.env.REACT_APP_API + "categoria";
  await fetch(url, {
    method: "POST",
    body: JSON.stringify(category),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function searchCustomerById(id: string) {
  let url = process.env.REACT_APP_API + "categoria/" + id;
  let response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return await response.json();
}
