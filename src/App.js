import React, { useEffect, useState } from 'react';
import { Service } from './Service';

function App() {

  const tenants = Service.getTenants()

  const [tenantsData, setTenantsData] = useState([])
  const [newTenantsData, setNewTenantsData] = useState([])


  useEffect( ()=> {
    tenants.then( response => {
      setTenantsData(response)
      setNewTenantsData(response)
    })
  }, [])

  const showAllTenants = () => setNewTenantsData(tenantsData)

  const filterData = (status) => {

    if (status === 'late') {
      const tenantsWithLatePayment = newTenantsData.filter( tenant => tenant.paymentStatus === 'LATE')
      setNewTenantsData(tenantsWithLatePayment)
    } else {
      // Created fake date for development purposes,
      const fakeCurrentDate = new Date('2021/08/22')

      // Helper function
      const daysBetweenDates = (date1, date2) => { 
        const difference = date1.getTime() - date2.getTime()
        const days = Math.ceil(difference / (1000 * 3600 * 24));
        console.log(days)
        return days
      }

      const tenantsLeaseEnds = newTenantsData.filter( tenant => {
        const leaseEndDate = new Date(tenant.leaseEndDate)
        return daysBetweenDates(fakeCurrentDate, leaseEndDate) < 30 && daysBetweenDates(fakeCurrentDate, leaseEndDate) > 0;
      })
      setNewTenantsData(tenantsLeaseEnds)
    }
  }

  return (
      <>
        <div className="container">
          <h1>Tenants</h1>
          <ul className="nav nav-tabs">
            <li className="nav-item" onClick={showAllTenants}>
              <a className="nav-link active" href="#">All</a>
            </li>
            <li className="nav-item" onClick={() => filterData('late')}>
              <a className="nav-link" href="#">Payment is late</a>
            </li>
            <li className="nav-item" onClick={() => filterData('leaseEnds')}>
              <a className="nav-link" href="#">Lease ends in less than a month</a>
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
                    <button className="btn btn-danger">Delete</button>
                  </td>
                </tr>
              )
              )}
            </tbody>
          </table>
        </div>
        <div className="container">
          <button className="btn btn-secondary">Add Tenant</button>
        </div>
        <div className="container">
          <form>
            <div className="form-group">
              <label>Name</label>
              <input className="form-control"/>
            </div>
            <div className="form-group">
              <label>Payment Status</label>
              <select className="form-control">
                <option>CURRENT</option>
                <option>LATE</option>
              </select>
            </div>
            <div className="form-group">
              <label>Lease End Date</label>
              <input className="form-control"/>
            </div>
            <button className="btn btn-primary">Save</button>
            <button className="btn">Cancel</button>
          </form>
        </div>
      </>
  );
}

export default App;
