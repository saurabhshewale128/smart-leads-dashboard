import { CSVLink } from "react-csv";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {

  const [leads, setLeads] = useState<any[]>([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("New");
  const [source, setSource] = useState("Website");

  const [search, setSearch] = useState("");

  const [filterStatus, setFilterStatus] = useState("");
  const [filterSource, setFilterSource] = useState("");

  const [editIndex, setEditIndex] = useState<number | null>(null);

  const [darkMode, setDarkMode] = useState(false);

  const navigate = useNavigate();

  // Fetch Leads
  const fetchLeads = async () => {

    try {

      const response = await axios.get(
        "http://localhost:5000/api/leads"
      );

      setLeads(response.data);

    } catch (error) {

      console.log(error);

      toast.error("Failed to fetch leads");
    }
  };

  // Load Leads
  useEffect(() => {
    fetchLeads();
  }, []);

  // Add or Update Lead
  const handleAddLead = async () => {

    if (!name || !email) {

      toast.error("Please fill all fields");

      return;
    }

    const newLead = {
      name,
      email,
      status,
      source,
    };

    try {

      // Edit Lead
      if (editIndex !== null) {

        const leadId = leads[editIndex]._id;

        await axios.put(
          `https://smart-leads-dashboard-wt5e.onrender.com/api/leads/${leadId}`,
          newLead
        );

        toast.success("Lead Updated");

        setEditIndex(null);

      } else {

        // Add Lead
        await axios.post(
          "http://localhost:5000/api/leads",
          newLead
        );

        toast.success("Lead Added");
      }

      fetchLeads();

      // Reset Fields
      setName("");
      setEmail("");
      setStatus("New");
      setSource("Website");

    } catch (error) {

      console.log(error);

      toast.error("Something went wrong");
    }
  };

  // Delete Lead
  const handleDelete = async (id: string) => {

    try {

      await axios.delete(
        `http://localhost:5000/api/leads/${id}`
      );

      toast.success("Lead Deleted");

      fetchLeads();

    } catch (error) {

      console.log(error);

      toast.error("Delete Failed");
    }
  };

  // Edit Lead
  const handleEdit = (index: number) => {

    const lead = leads[index];

    setName(lead.name);
    setEmail(lead.email);
    setStatus(lead.status);
    setSource(lead.source);

    setEditIndex(index);
  };

  // Logout
  const handleLogout = () => {

    localStorage.removeItem("token");

    toast.success("Logged Out");

    navigate("/");
  };

  // Search + Filter
  const filteredLeads = leads.filter((lead) => {

    const matchesSearch =
      lead.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||

      lead.email
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesStatus =
      filterStatus === "" ||
      lead.status === filterStatus;

    const matchesSource =
      filterSource === "" ||
      lead.source === filterSource;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesSource
    );
  });

  // Analytics
  const totalLeads = leads.length;

  const qualifiedLeads = leads.filter(
    (lead) => lead.status === "Qualified"
  ).length;

  const contactedLeads = leads.filter(
    (lead) => lead.status === "Contacted"
  ).length;

  const lostLeads = leads.filter(
    (lead) => lead.status === "Lost"
  ).length;

  // Chart Data
  const chartData = [
    {
      name: "Qualified",
      value: qualifiedLeads,
    },

    {
      name: "Contacted",
      value: contactedLeads,
    },

    {
      name: "Lost",
      value: lostLeads,
    },
  ];

  // Chart Colors
  const COLORS = [
    "#22c55e",
    "#3b82f6",
    "#ef4444",
  ];

  return (

    <div className="flex min-h-screen">

      {/* Sidebar */}
      <div
        className={`hidden md:block w-64 min-h-screen p-5 ${
          darkMode
            ? "bg-gray-800 text-white"
            : "bg-white text-black"
        }`}
      >

        <h2 className="text-2xl font-bold mb-8">
          CRM Panel
        </h2>

        <ul className="space-y-4">

          <li className="bg-blue-600 text-white px-4 py-3 rounded-lg cursor-pointer">
            Dashboard
          </li>

          <li className="hover:bg-gray-300 px-4 py-3 rounded-lg cursor-pointer">
            Leads
          </li>

          <li className="hover:bg-gray-300 px-4 py-3 rounded-lg cursor-pointer">
            Analytics
          </li>

          <li className="hover:bg-gray-300 px-4 py-3 rounded-lg cursor-pointer">
            Settings
          </li>

        </ul>

      </div>

      {/* Main Content */}
      <div
        className={`flex-1 ${
          darkMode
            ? "bg-gray-900 text-white"
            : "bg-gray-100 text-black"
        }`}
      >

        {/* Navbar */}
        <div
          className={`shadow p-4 flex justify-between items-center ${
            darkMode
              ? "bg-gray-800"
              : "bg-white"
          }`}
        >

          <h1 className="text-lg md:text-2xl font-bold">
            Smart Leads Dashboard
          </h1>

          <div className="flex gap-2">

            {/* Dark Mode */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="bg-black text-white px-4 py-2 rounded-lg"
            >
              {darkMode ? "Light" : "Dark"}
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg"
            >
              Logout
            </button>

          </div>

        </div>

        <div className="p-6">

          {/* Add Lead Form */}
          <div
            className={`p-6 rounded-2xl shadow mb-6 ${
              darkMode
                ? "bg-gray-800"
                : "bg-white"
            }`}
          >

            <h2 className="text-2xl font-bold mb-4">
              {editIndex !== null
                ? "Edit Lead"
                : "Add Lead"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Name */}
              <input
                type="text"
                placeholder="Enter Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border p-3 rounded-lg text-black"
              />

              {/* Email */}
              <input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border p-3 rounded-lg text-black"
              />

              {/* Status */}
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="border p-3 rounded-lg text-black"
              >
                <option>New</option>
                <option>Contacted</option>
                <option>Qualified</option>
                <option>Lost</option>
              </select>

              {/* Source */}
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="border p-3 rounded-lg text-black"
              >
                <option>Website</option>
                <option>Instagram</option>
                <option>Referral</option>
              </select>

            </div>

            {/* Add Button */}
            <button
              onClick={handleAddLead}
              className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              {editIndex !== null
                ? "Update Lead"
                : "Add Lead"}
            </button>

          </div>

          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

            <div
              className={`p-5 rounded-2xl shadow ${
                darkMode
                  ? "bg-gray-800"
                  : "bg-white"
              }`}
            >
              <h3 className="text-lg font-semibold">
                Total Leads
              </h3>

              <p className="text-3xl font-bold mt-2">
                {totalLeads}
              </p>
            </div>

            <div
              className={`p-5 rounded-2xl shadow ${
                darkMode
                  ? "bg-gray-800"
                  : "bg-white"
              }`}
            >
              <h3 className="text-lg font-semibold">
                Qualified
              </h3>

              <p className="text-3xl font-bold mt-2 text-green-500">
                {qualifiedLeads}
              </p>
            </div>

            <div
              className={`p-5 rounded-2xl shadow ${
                darkMode
                  ? "bg-gray-800"
                  : "bg-white"
              }`}
            >
              <h3 className="text-lg font-semibold">
                Contacted
              </h3>

              <p className="text-3xl font-bold mt-2 text-blue-500">
                {contactedLeads}
              </p>
            </div>

            <div
              className={`p-5 rounded-2xl shadow ${
                darkMode
                  ? "bg-gray-800"
                  : "bg-white"
              }`}
            >
              <h3 className="text-lg font-semibold">
                Lost
              </h3>

              <p className="text-3xl font-bold mt-2 text-red-500">
                {lostLeads}
              </p>
            </div>

          </div>

          {/* Charts */}
          <div
            className={`p-6 rounded-2xl shadow mb-6 ${
              darkMode
                ? "bg-gray-800"
                : "bg-white"
            }`}
          >

            <h2 className="text-2xl font-bold mb-6">
              Leads Analytics
            </h2>

            <div className="w-full h-[400px]">

              <ResponsiveContainer>

                <PieChart>

                <Pie
                data={chartData}
                dataKey="value"
                outerRadius={120}
                label
                >

                {chartData.map((_, index) => (

               <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
               />

               ))}

              </Pie>

                  <Tooltip />

                </PieChart>

              </ResponsiveContainer>

            </div>

          </div>

          {/* Export CSV */}
          <div className="mb-4">

            <CSVLink
              data={leads}
              filename={"leads-data.csv"}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
            >
              Export CSV
            </CSVLink>

          </div>

          {/* Search */}
          <div className="mb-4">

            <input
              type="text"
              placeholder="Search by name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border p-3 rounded-lg text-black"
            />

          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border p-3 rounded-lg text-black"
            >
              <option value="">All Status</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Lost">Lost</option>
            </select>

            {/* Source Filter */}
            <select
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value)}
              className="border p-3 rounded-lg text-black"
            >
              <option value="">All Sources</option>
              <option value="Website">Website</option>
              <option value="Instagram">Instagram</option>
              <option value="Referral">Referral</option>
            </select>

          </div>

          {/* Leads Table */}
          <div
            className={`rounded-2xl shadow overflow-hidden ${
              darkMode
                ? "bg-gray-800"
                : "bg-white"
            }`}
          >

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-gray-200 text-black">

                  <tr>

                    <th className="text-left p-4">
                      Name
                    </th>

                    <th className="text-left p-4">
                      Email
                    </th>

                    <th className="text-left p-4">
                      Status
                    </th>

                    <th className="text-left p-4">
                      Source
                    </th>

                    <th className="text-left p-4">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredLeads.map((lead, index) => (

                    <tr
                      key={lead._id}
                      className="border-b"
                    >

                      <td className="p-4">
                        {lead.name}
                      </td>

                      <td className="p-4">
                        {lead.email}
                      </td>

                      <td className="p-4">
                        {lead.status}
                      </td>

                      <td className="p-4">
                        {lead.source}
                      </td>

                      <td className="p-4 flex gap-2">

                        {/* Edit */}
                        <button
                          onClick={() => handleEdit(index)}
                          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                        >
                          Edit
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(lead._id)}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                        >
                          Delete
                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}