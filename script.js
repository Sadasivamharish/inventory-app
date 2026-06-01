let editingId = null;
document.getElementById("itemForm").addEventListener("submit", async (e) => {

    e.preventDefault();

    const data = {
        name: document.getElementById("itemName").value,
        purchase_date: document.getElementById("purchaseDate").value,
        stock_available: document.getElementById("stockAvailable").checked,
        item_type_id: document.getElementById("itemType").value
    };

    try {

        const url = editingId
    ? `http://localhost:5000/api/items/${editingId}`
    : "http://localhost:5000/api/items";

const method = editingId
    ? "PUT"
    : "POST";

const response = await fetch(url, {
    method,
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
});

        const result = await response.json();

        alert(result.message);

editingId = null;

loadItems();

document.getElementById("itemForm").reset();

    } catch (error) {
        console.error(error);
    }

});
async function loadItems() {

    const response = await fetch(
        "http://localhost:5000/api/items"
    );

    const items = await response.json();

    const tableBody =
        document.getElementById("tableBody");

    tableBody.innerHTML = "";

    items.forEach(item => {

        tableBody.innerHTML += `
            <tr>
                <td>${item.name}</td>
                <td>${item.type_name}</td>
                <td>${new Date(item.purchase_date).toLocaleDateString("en-GB")}</td>
                <td>${item.stock_available ? "Yes" : "No"}</td>
                <td>
    <button onclick="editItem(${item.id},
    '${item.name}',
    '${item.purchase_date.split("T")[0]}',
    ${item.stock_available},
    '${item.type_name}')">
    Edit
    </button>

    <button onclick="deleteItem(${item.id})">
    Delete
    </button>
</td>
            </tr>
        `;
    });

}

loadItems();

async function deleteItem(id) {

    const confirmDelete =
        confirm("Are you sure?");

    if (!confirmDelete) return;

    await fetch(
        `http://localhost:5000/api/items/${id}`,
        {
            method: "DELETE"
        }
    );

    loadItems();
}

function editItem(
    id,
    name,
    purchaseDate,
    stock,
    typeName
) {

    editingId = id;

    document.getElementById("itemName").value = name;
    document.getElementById("purchaseDate").value = purchaseDate;
    document.getElementById("stockAvailable").checked = stock;

    const itemType =
        document.getElementById("itemType");

    if (typeName === "Electronics")
        itemType.value = "1";

    if (typeName === "Furniture")
        itemType.value = "2";

    if (typeName === "Clothing")
        itemType.value = "3";

}