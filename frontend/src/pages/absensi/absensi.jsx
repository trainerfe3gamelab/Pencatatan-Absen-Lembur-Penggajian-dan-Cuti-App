import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import SearchBox from '../../components/search/SearchBox';
import { Modal, Button, Form } from 'react-bootstrap';
import Success from '../../image/success.png';
import Failed from '../../image/failed.png';
import axios from 'axios';
import { API_URL } from '../../helpers/networt';

const Absensi = () => {


    const [records, setRecords] = useState([]);
    const [positions, setPositions] = useState([]);
    const [users, setUsers] = useState([]);

    const koneksi = async () => {
        const token = localStorage.getItem('token');
        try {
            const [responseAbsensi, responseUser, responsePosition] = await Promise.all([
                axios.get(`${API_URL}/api/admin/attendances`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get(`${API_URL}/api/admin/users`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get(`${API_URL}/api/admin/positions`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

            const absensiData = responseAbsensi.data.data;
            const userData = responseUser.data.data;
            const positionsData = responsePosition.data.data;
            setPositions(positionsData);
            setUsers(userData);

            const records = absensiData.map(absensi => {
                const user = userData.find(user => user.id === absensi.user_id);
                const position = user ? positionsData.find(position => position.id === user.position_id) : null;
                return {
                    ...absensi,
                    name: user ? user.name : 'Unknown User',
                    gender: user ? user.gender : 'Unknown Gender',
                    position_name: position ? position.position_name : 'Unknown Position',
                    status: absensi.status,
                    time_in: absensi.time_in,
                    time_out: absensi.time_out
                };
            });

            console.log(records);
            setRecords(records);

        } catch (error) {
            console.error("Error fetching data", error);
        }
    };


    useEffect(() => {
        koneksi();
    }, []);


    const columns = [
        {
            name: "#",
            selector: (row, index) => index + 1,
            sortable: true
        },
        {
            name: "Nama",
            selector: row => row.name,
            sortable: true
        },
        {
            name: "Jenis Kelamin",
            selector: row => row.gender,
            sortable: true
        },
        {
            name: "Jabatan",
            selector: row => row.position_name,
            sortable: true
        },
        {
            name: "Status",
            selector: row => row.status,
            sortable: true
        },
        {
            name: "Tanggal",
            selector: row => row.date,
            sortable: true
        },
        {
            name: "Waktu Masuk",
            selector: row => row.time_in,
            sortable: true
        },
        {
            name: "Waktu Keluar",
            selector: row => row.time_out,
            sortable: true
        },
        {
            name: "Actions",
            cell: row => (
                <>
                    <Button variant="success" onClick={() => handleEdit(row)} className="me-2 "><i className="bi bi-pencil-fill text-white"></i></Button>
                    <Button variant="danger" onClick={() => handleDelete(row.id)} ><i className="bi bi-trash3-fill"></i></Button>
                </>
            )
        }
    ];

    const initialData = [
        { id: 1, name: 'alpa', kelamin: 'laki-laki', jabatan: 'staf admin', status: 'hadir', tanggal: '10-2-2024', timein: '07:45', timeout: '17:33' },
        { id: 2, name: 'beta', kelamin: 'perempuan', jabatan: 'manager', status: 'alpa', tanggal: '11-2-2024', timein: '08:00', timeout: '18:00' },
        { id: 3, name: 'gamma', kelamin: 'laki-laki', jabatan: 'security', status: 'alpa', tanggal: '12-2-2024', timein: '06:30', timeout: '16:30' },
        { id: 4, name: 'delta', kelamin: 'perempuan', jabatan: 'staf IT', status: 'hadir', tanggal: '13-2-2024', timein: '09:00', timeout: '19:00' },
        { id: 5, name: 'epsilon', kelamin: 'laki-laki', jabatan: 'staf HR', status: 'hadir', tanggal: '14-2-2024', timein: '08:15', timeout: '17:45' },
        { id: 6, name: 'zeta', kelamin: 'perempuan', jabatan: 'sekretaris', status: 'alpa', tanggal: '15-2-2024', timein: '08:30', timeout: '17:30' },
        { id: 7, name: 'eta', kelamin: 'laki-laki', jabatan: 'staf keuangan', status: 'hadir', tanggal: '16-2-2024', timein: '07:50', timeout: '16:50' },
        { id: 8, name: 'theta', kelamin: 'perempuan', jabatan: 'kasir', status: 'alpa', tanggal: '17-2-2024', timein: '09:10', timeout: '18:10' },
        { id: 9, name: 'iota', kelamin: 'laki-laki', jabatan: 'driver', status: 'alpa', tanggal: '18-2-2024', timein: '06:45', timeout: '16:45' },
        { id: 10, name: 'kappa', kelamin: 'perempuan', jabatan: 'staf marketing', status: 'hadir', tanggal: '19-2-2024', timein: '08:00', timeout: '17:00' },
        { id: 11, name: 'lambda', kelamin: 'laki-laki', jabatan: 'staf produksi', status: 'hadir', tanggal: '20-2-2024', timein: '07:30', timeout: '16:30' },
        { id: 12, name: 'mu', kelamin: 'perempuan', jabatan: 'staf admin', status: 'hadir', tanggal: '21-2-2024', timein: '08:20', timeout: '17:20' },
        { id: 13, name: 'nu', kelamin: 'laki-laki', jabatan: 'staf gudang', status: 'hadir', tanggal: '22-2-2024', timein: '07:40', timeout: '16:40' },
    ];


    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showFailedModal, setShowFailedModal] = useState(false);
    const [editData, setEditData] = useState({ id:'', user_id: '', name: '', gender: '', position_id: '', status: '', date: '', time_in: '', time_out: '' });
    const [newData, setNewData] = useState({user_id: '', name: '', gender: '', position_id: '', status: '', date: '', time_in: '', time_out: ''  });
    const [filteredRecords, setFilteredRecords] = useState(null);
    const [filterCriteria, setFilterCriteria] = useState({ date: '', gender: '', position: '' });


    const handleCloseEdit = () => setShowEditModal(false);
    const handleShowEdit = () => setShowEditModal(true);

    const handleCloseAdd = () => setShowAddModal(false);
    const handleShowAdd = () => setShowAddModal(true);

    const handleCloseSuccess = () => setShowSuccessModal(false);
    const handleShowSuccess = () => setShowSuccessModal(true);

    const handleCloseFailed = () => setShowFailedModal(false);
    const handleShowFailed = () => setShowFailedModal(true);

    const handleCloseFilter = () => setShowFilterModal(false);
    const handleShowFilter = () => setShowFilterModal(true);

    const handleEdit = (row) => {
        setEditData(row);
        handleShowEdit();
    };

    const handleSaveEdit = async () => {
        const token = localStorage.getItem('token');
        const userId = editData.id;
        const updatedUserData = {
            user_id: editData.user_id, 
            status: editData.status,
            date: editData.date,
            time_in: editData.time_in,
            time_out: editData.time_out,
        };
    
        console.log("id=", userId);
        console.log("Updated Data=", updatedUserData);
        
        try {
            const response = await axios.put(`${API_URL}/api/admin/attendances/${userId}`, updatedUserData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log("User data updated successfully:", response.data);
            handleCloseEdit();
            koneksi();
            handleShowSuccess();
        } catch (error) {
            console.error("Error updating user data:", error);
            handleCloseEdit();
            handleShowFailed();
        }
    };
    

    const handleDelete = async (id) => {
        const token = localStorage.getItem('token');
    
        try {
            // Send a DELETE request to the API endpoint
            await axios.delete(`${API_URL}/api/admin/attendances/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
    
            // Update the records state to remove the deleted record
            setRecords(records.filter(record => record.id !== id));
            console.log(`Data with ID ${id} deleted successfully.`);
        } catch (error) {
            console.error("Error deleting data:", error);
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setEditData({ ...editData, [name]: value });
    };

    const handleNewInputChange = (event) => {
        const { name, value } = event.target;
        setNewData({ ...newData, [name]: value });
    };






    const handleSaveAdd = async () => {
        try {
            const token = localStorage.getItem('token'); 
    
            const requestData = {
                user_id: newData.user_id,
                status: newData.status,
                date: newData.date,
                time_in: newData.time_in,
                time_out: newData.time_out
            };
    
            const response = await axios.post(`${API_URL}/api/admin/attendances`, requestData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
    
            console.log('Response:', response.data);
    
            handleCloseAdd();
            koneksi();
            handleShowSuccess();
        } catch (error) {
            console.error("Error adding attendance data:", error);
            handleCloseAdd();
            handleShowFailed();
        }
    };
    

    

    const handleFilter = (event) => {
        const searchTerm = event.target.value.toLowerCase();
        if (searchTerm === "") {
            koneksi(); 
        } else {
            const newData = records.filter(row => {
                return Object.values(row).some(value => 
                    typeof value === 'string' && value.toLowerCase().includes(searchTerm)
                );
            });
            setRecords(newData);
        }
    };

    const handleFilterCriteriaChange = (event) => {
        const { name, value } = event.target;
        setFilterCriteria({ ...filterCriteria, [name]: value });
    };

    const handleFilterButton = () => {
        let newFilteredRecords = records;

        if (filterCriteria.date) {
            newFilteredRecords = newFilteredRecords.filter(record => record.date === filterCriteria.date);
        }

        if (filterCriteria.status) {
            newFilteredRecords = newFilteredRecords.filter(record => record.status === filterCriteria.status);
        }


        setFilteredRecords(newFilteredRecords);
        setShowFilterModal(false);
    };

    const getFilterCriteriaText = () => {
        const { date, status,  } = filterCriteria;
        const criteriaText = [];

        if (date) criteriaText.push(`Tanggal: ${date}`);
        if (status) criteriaText.push(`Status: ${status}`);
       

        return criteriaText.length ? criteriaText.join(', ') : 'Tidak ada filter yang diterapkan';
    };

    return (
        <div className='container'>
            <h1 className='mt-3 mb-3'><b>Absensi</b></h1>
            <div className='d-flex justify-content-between mb-3'>
                <Button variant="primary" className="text-white me-2 " style={{ borderRadius: '15px', height: '30px', backgroundColor: '#18C89E' }} onClick={handleShowAdd}>
                    <i className="bi bi-plus-circle-fill" aria-hidden="true"></i> Tambah
                </Button>
                <div>
                    <Button variant="primary" className="text-white me-2 " style={{ borderRadius: '15px', height: '30px', backgroundColor: '#18C89E' }} onClick={handleShowFilter}>
                        <i class="bi bi-funnel-fill" aria-hidden="true"></i> Filter
                    </Button>
                    <SearchBox onChange={handleFilter} />
                </div>
            </div>
            {filteredRecords && (
                <div className='mb-2'>
                    <div className='col-6 text-success'>
                        <p>Filter berdasarkan {getFilterCriteriaText()}</p>
                    </div>
                </div>
            )}
            <div className='bg-white border rounded-4'>
                <DataTable
                    columns={columns}
                    data={filteredRecords || records}
                    fixedHeader
                    pagination
                />
            </div>





            {/* Edit Modal */}
            <Modal show={showEditModal} onHide={handleCloseEdit}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Absensi</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formNama">
                        <Form.Control
                        style={{ display: 'none' }}
                                type="text"
                                name="id"
                                value={editData.id}
                                onChange={handleInputChange}
                            />
                            <Form.Label>Nama</Form.Label>
                            <Form.Control
                                as="select"
                                name="user_id"
                                value={editData.user_id}
                                onChange={handleInputChange}
                            >
                                <option value="">Pilih nama Pegawai</option>
                                {users.map(user => (
                                    <option key={user.id} value={user.id}>
                                        {user.name}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="formStatus">
                            <Form.Label>Status</Form.Label>
                            <Form.Control
                                type="text"
                                name="status"
                                value={editData.status}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formTanggal">
                            <Form.Label>Tanggal</Form.Label>
                            <Form.Control
                                type="date"
                                name="date"
                                value={editData.date}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formTimein">
                            <Form.Label>Waktu Masuk</Form.Label>
                            <Form.Control
                                type="text"
                                name="time_in"
                                value={editData.time_in}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formTimeout">
                            <Form.Label>Waktu Keluar</Form.Label>
                            <Form.Control
                                type="text"
                                name="time_out"
                                value={editData.time_out}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={handleSaveEdit}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Add Modal */}
            <Modal show={showAddModal} onHide={handleCloseAdd}>
    <Modal.Header closeButton>
        <Modal.Title>Tambah Data</Modal.Title>
    </Modal.Header>
    <Modal.Body>
        <Form>
            <Form.Group controlId="formNama">
                <Form.Label>Nama</Form.Label>
                <Form.Control
                    as="select"
                    name="user_id"
                    value={newData.user_id}
                    onChange={handleNewInputChange}
                >
                    <option value="">Pilih nama Pegawai</option>
                    {users.map(user => (
                        <option key={user.id} value={user.id}>
                            {user.name}
                        </option>
                    ))}
                </Form.Control>
            </Form.Group>
            <Form.Group controlId="formStatus">
                <Form.Label>Status</Form.Label>
                <Form.Control
                    type="text"
                    name="status"
                    value={newData.status}
                    onChange={handleNewInputChange}
                />
            </Form.Group>
            <Form.Group controlId="formTanggal">
                <Form.Label>Tanggal</Form.Label>
                <Form.Control
                    type="date"
                    name="date"
                    value={newData.date}
                    onChange={handleNewInputChange}
                />
            </Form.Group>
            <Form.Group controlId="formTimein">
                <Form.Label>Waktu Masuk</Form.Label>
                <Form.Control
                    type="text"
                    name="time_in"
                    value={newData.time_in}
                    onChange={handleNewInputChange}
                />
            </Form.Group>
            <Form.Group controlId="formTimeout">
                <Form.Label>Waktu Keluar</Form.Label>
                <Form.Control
                    type="text"
                    name="time_out"
                    value={newData.time_out}
                    onChange={handleNewInputChange}
                />
            </Form.Group>
        </Form>
    </Modal.Body>
    <Modal.Footer>
        <Button variant="success" onClick={handleSaveAdd}>
            Simpan
        </Button>
    </Modal.Footer>
</Modal>



            {/* Success Modal */}
            <Modal show={showSuccessModal} onHide={handleCloseSuccess}>
                <Modal.Body className="text-center mt-5">
                    <img src={Success} alt="success" width={70} />
                    <h5 className="mt-3">Berhasil</h5>
                    <p>Data berhasil disimpan</p>
                </Modal.Body>
                <Modal.Footer style={{ borderTop: 'none' }}>
                    <Button variant="primary" onClick={handleCloseSuccess}>
                        Tutup
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Failed Modal */}
            <Modal show={showFailedModal} onHide={handleCloseFailed}>
                <Modal.Body className="text-center mt-5">
                    <img src={Failed} alt="Failed" width={70} />
                    <h5 className="mt-3">Gagal</h5>
                    <p>Data gagal disimpan</p>
                </Modal.Body>
                <Modal.Footer style={{ borderTop: 'none' }}>
                    <Button variant="primary" onClick={handleCloseFailed}>
                        Tutup
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Filter Modal */}
            <Modal show={showFilterModal} onHide={handleCloseFilter}>
                <Modal.Header closeButton>
                    <Modal.Title>Filter Data</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formTanggal">
                            <Form.Label>Tanggal</Form.Label>
                            <Form.Control
                                type="date"
                                name="date"
                                onChange={handleFilterCriteriaChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formTanggal">
                            <Form.Label>Status</Form.Label>
                            <Form.Control
                                type="text"
                                name="status"
                                onChange={handleFilterCriteriaChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer style={{ borderTop: 'none' }}>
                    <Button variant="primary" onClick={handleFilterButton}>
                        Filter
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Absensi;
