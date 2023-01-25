import './App.css';
import React from 'react';
import { Button, CircularProgress, IconButton, Pagination, Rating, Tooltip, Typography } from '@mui/material';
import { MdInfo, MdVisibility } from 'react-icons/md';
import { moneyMask } from './Utils/moneyMask';
// import Filter from './Filter';

function App() {
  const [products, setProducts] = React.useState(null)
  const [search, setSearch] = React.useState(true)
  const [dateOf, setDateOf] = React.useState('')
  const [dateFor, setDateFor] = React.useState('')
  const [loading, setLoading] = React.useState(true)
  const [pagination, setPagination] = React.useState({
    totalItems: '', pageNumber: 1, perPage: 10
  })
  const [options, setOptions] = React.useState({
    paid: { value: false, label: 'Pago', checked: false },
    failed: { value: false, label: 'Falha', checked: false },
    canceled: { value: false, label: 'Cancelado', checked: false },
    pending: { value: false, label: 'Pendente', checked: false },
  })


  React.useEffect(() => {
    const getData = () => {
      setLoading(true)
      fetch(`https://dummyjson.com/products?limit=10&skip=${pagination.pageNumber}0`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }).then(async (response) => {
        const json = await response.json()
        setPagination({ ...pagination, totalItems: json.total }); setProducts(json.products); setLoading(false)
      })
    }

    window.scrollTo(0, 0); getData()
  }, [pagination.pageNumber, search, dateOf, dateFor])

  const handleSize = (description) => {
    let value = Array.from(description)
    let tooltip = false
    if (value.length > 40) { value = value.splice(0, 40).toString().replace(/,/g, '') + '...'; tooltip = true }
    else { value = value.toString().replace(/,/g, ''); tooltip = false }

    return { value, tooltip }
  }

  return (
    <div className="d-flex align-items-center" style={{ backgroundColor: '#E8E8E8' }}>
      <div className='bg-white rounded m-auto my-5 p-3' style={{ maxWidth: 1200, width: '100%', minHeight: '100vh' }}>
        <div className="d-flex">
          <h6 className='display-6'>Lista de Produtos</h6>
          {/* <Filter /> */}
        </div>
        <div style={{ minHeight: '100vh' }}>
          {!loading ?
            <table className='table table-hover table-stripped text-center'>
              <thead>
                <tr className='small' style={{ fontWeight: 500 }}>
                  <td>IMAGEM</td>
                  <td>NOME</td>
                  <td>MARCA</td>
                  <td>DESCRIÇÃO</td>
                  <td>PREÇO</td>
                  <td>AVALIAÇÃO</td>
                  <td>ESTOQUE</td>
                  <td>DESCONTO</td>
                  <td>AÇÕES</td>
                </tr>
              </thead>
              <tbody>
                {products && products.map((item, index) => {
                  const description = handleSize(item.description)
                  const title = handleSize(item.title)
                  return (
                    <tr key={index} className='lead'>
                      <td>
                        <div style={{ width: 100, height: 100 }}>
                          <img className='product-img' src={item.thumbnail} alt="product" />
                        </div>
                      </td>
                      <td>{title.tooltip ?
                        <Tooltip placement='top' arrow title={item.name}><p>{title.value}</p></Tooltip> : title.value
                      }</td>
                      <td>{item.brand}</td>
                      <td>{description.tooltip ?
                        <Tooltip placement='top' arrow title={item.description}>
                          <p style={{ cursor: 'pointer' }}>{description.value}</p>
                        </Tooltip> : description.value
                      }
                      </td>
                      <td>{moneyMask(item.price)}</td>
                      <td>
                        <div className="d-flex">
                          <Rating className='me-2' name="read-only" value={item.rating} readOnly />

                          <Tooltip placement='top' arrow title={item.rating}>
                            <IconButton sx={{ padding: 0 }}><MdInfo /></IconButton>
                          </Tooltip>
                        </div></td>
                      <td>{item.stock} Un</td>
                      <td>{item.discountPercentage}%</td>
                      <td><IconButton color='primary'><MdVisibility /></IconButton></td>
                    </tr>
                  )
                })}
              </tbody>
            </table> : <div className='d-flex justify-content-center p-5'><CircularProgress /></div>}
        </div>

        {pagination.totalItems &&
          <div className='d-flex justify-content-end'>
            <Pagination color='primary' shape="rounded" count={Math.ceil(pagination.totalItems / pagination.perPage)} page={pagination.pageNumber} onChange={(e, page) => {
              setPagination({ ...pagination, pageNumber: page }); setSearch(true)
            }
            } />
          </div>
        }
      </div>
    </div>
  );
}

export default App;
