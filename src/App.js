import React, { useEffect, useState } from 'react';
import { Service } from './Service';
import './App.css'
import { daysBetweenDates } from './helpers';

function App() {

  const [tenantsData, setTenantsData] = useState([])
  const [newTenantsData, setNewTenantsData] = useState([])
  const [isActive, setIsActive] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const initialValues = { name: "", paymentStatus: "", leaseEndDate: "" };
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});

  useEffect( ()=> {
    Service.getTenants().then( response => {
      setTenantsData(response)
      setNewTenantsData(response)
    })
  }, [])

  const showAllTenants = () => {
    setNewTenantsData(tenantsData)
    toggler()
  }

  const filterData = (status) => {

    if (status === 'late') {
      const tenantsWithLatePayment = newTenantsData.filter( tenant => tenant.paymentStatus === 'LATE')
      setNewTenantsData(tenantsWithLatePayment)
      toggler()
    } else {
      // Created fake date for development purposes,
      const fakeCurrentDate = new Date('2021/08/22')
      const tenantsLeaseEnds = newTenantsData.filter( tenant => {
        const leaseEndDate = new Date(tenant.leaseEndDate)
        return daysBetweenDates(fakeCurrentDate, leaseEndDate) < 30 && daysBetweenDates(fakeCurrentDate, leaseEndDate) > 0;
      })
      setNewTenantsData(tenantsLeaseEnds)
      toggler()
    }
  }


  const submitHandler = (event) => {
    event.preventDefault()
    
    const hasErrors = Object.keys(validate(formValues)).length !== 0
    
    if(!hasErrors) {
      const newTenant = { 
        name: event.target['name'].value,
        paymentStatus: event.target['paymentStatus'].value,
        leaseEndDate: (new Date(event.target['leaseEndDate'].value)).toISOString(),
      }

      Service.addTenant(newTenant).then( () => Service.getTenants().then( resp => { 
        setNewTenantsData(resp)
      }) )
    } else {

      setFormErrors(validate(formValues));
    }
  }

  const handleChange = (event) => {
    const {name, value} = event.target
    setFormValues({...formValues, [name]: value})
  }

  const validate = (values) => {
    const errors = {};
    if (!values.name) {
      errors.name = "A name is required!";
    } else if (values.name.length < 2) {
      errors.name = "The typed name must be more than 2 characters";
    } else if (values.name.length > 25) {
      errors.name = "The typed name cannot exceed more than 25 characters";
    }
    if(!values.leaseEndDate) {
      errors.leaseEndDate = "Format should be YYYY-MM-DD"
    }
    return errors;
  };

  const cancelForm = () => {
    setShowForm(false)
    setFormValues(initialValues)
    setFormErrors({})
  }

  const deleteTenant = (id) => {
    Service.deleteTenant(id).then( () => Service.getTenants().then( resp => setNewTenantsData(resp)) )
  }

  const toggler = () =>  {
    isActive ? setIsActive(false) : setIsActive(true)
  }

  return (
      <>
        <div className="container">
          <h1>Tenants</h1>
          <ul className="nav nav-tabs">
            <li className="nav-item" onClick={showAllTenants}>
              <a className={isActive ? "nav-link active" : "nav-link"} href="#">All</a>
            </li>
            <li className="nav-item" onClick={() => filterData('late')}>
              <a className={!isActive ? "nav-link active" : "nav-link"} href="#">Payment is late</a>
            </li>
            <li className="nav-item" onClick={() => filterData('leaseEnds')}>
              <a className={!isActive ? "nav-link active" : "nav-link"} href="#">Lease ends in less than a month</a>
            </li>
          </ul>
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Payment Status</th>
                <th>Lease End Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {newTenantsData.map( ({ id, name, paymentStatus, leaseEndDate}) => (
                <tr key={id}>
                  <th>{id}</th>
                  <td>{name}</td>
                  <td>{paymentStatus}</td>
                  <td>{leaseEndDate}</td>
                  <td>
                    <button className="btn btn-danger" onClick={()=> deleteTenant(id)}>Delete</button>
                  </td>
                </tr>
              )
              )}
            </tbody>
          </table>
        </div>
        <div className="container">
          <button className="btn btn-secondary" onClick={() => setShowForm(!showForm)}>Add Tenant</button>
        </div>
        {showForm && (
          <div className="container">
            <form onSubmit={submitHandler} >
              <div className="form-group">
                <label>Name</label>
                <input className="form-control" id='name' name='name' type="text" value={formValues.name} onChange={handleChange}/>
                {formErrors && formErrors.name && (<div className="is-invalid">{formErrors.name}</div>)} 
              </div>
              <div className="form-group">
                <label>Payment Status</label>
                <select className="form-control" id='paymentStatus' name='paymentStatus' onChange={handleChange} value={formValues.paymentStatus}>
                  <option>CURRENT</option>
                  <option>LATE</option>
                </select>
                <div className="is-invalid">{formErrors.paymentStatus}</div>
              </div>
              <div className="form-group">
                <label>Lease End Date</label>
                <input className="form-control" id='leaseEndDate' name='leaseEndDate' onChange={handleChange} value={formValues.leaseEndDate}/>
                {formErrors && formErrors.leaseEndDate && (<div className="is-invalid">{formErrors.leaseEndDate}</div>)} 
              </div>
              <button className="btn btn-primary" type='submit'>Save</button>
              <button className="btn" onClick={cancelForm}>Cancel</button>
            </form>
          </div>
        )}
        
      </>
  );
}

export default App;
