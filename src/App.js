import './App.css';
import React from 'react';
import { CircularProgress, IconButton, Pagination, Rating, Tooltip, TextField, InputAdornment } from '@mui/material';
import { MdInfo, MdVisibility, MdEdit, MdDelete, MdSearch } from 'react-icons/md';
import { moneyMask } from './Utils/moneyMask';
import Images from './Screens/Images';
import { GET_FETCH } from './Utils/Requests';
import Filter from './Filter';
import { renderAlert, renderToast, ToastContent } from './Utils/Alerts';

function App() {
  const [allow, setAllow] = React.useState(true)
  const [search, setSearch] = React.useState('')
  const [options, setOptions] = React.useState('')
  const [loading, setLoading] = React.useState(true)
  const [products, setProducts] = React.useState(null)
  const [pagination, setPagination] = React.useState({
    totalItems: '', pageNumber: 0, perPage: 10
  })

  React.useEffect(() => {
    const getOptions = async () => {
      const response = await GET_FETCH({ url: 'https://dummyjson.com/products/categories' })

      let newOptionsArr = []
      response.forEach((item, index) => newOptionsArr = [...newOptionsArr, { label: item, value: false, id: index }])
      setOptions(newOptionsArr)
    }

    getOptions()
  }, [])

  let timeout
  // React.useEffect(() => {
  //   clearTimeout(timeout)
  //   timeout = setTimeout(() => { getData() }, 2000)
  // }, [search])

  const handleSearch = (value) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => { setSearch(value); setPagination({ ...pagination, pageNumber: 0 }) }, 750)
  }

  React.useEffect(() => {
    if (allow) getData()
  }, [pagination.pageNumber, allow, search])

  const getData = async () => {
    setLoading(true); let category = ''
    if (options) category = options.filter(item => item.value === true)[0]
    const response = await GET_FETCH({
      url: `https://dummyjson.com/products${search ? '/search?q=' + search : (category ? '/category/' + category.label : '')}${search ? '&' : '?'}limit=10&skip=${pagination.pageNumber}0`
    })

    setPagination({ ...pagination, totalItems: response.total }); setProducts(response.products); setLoading(false);
  }

  const handleSize = (description) => {
    let value = Array.from(description)
    let tooltip = false
    if (value.length > 40) { value = value.splice(0, 40).toString().replace(/,/g, '') + '...'; tooltip = true }
    else { value = value.toString().replace(/,/g, ''); tooltip = false }

    return { value, tooltip }
  }

  return (
    <div className="d-flex align-items-center" style={{ backgroundColor: '#E8E8E8' }}>
      <div className='bg-white rounded m-auto my-5 p-3' style={{ maxWidth: 1300, width: '100%', minHeight: '100vh' }}>
        <div className="row">
          <div className='col-4'>
            <div className="d-flex align-items-center">
              <span className='display-6' style={{ margin: '0 !important' }}>Products List</span>
              <Filter options={options} setOptions={setOptions} setAllow={setAllow} pagination={pagination} setPagination={setPagination} setSearch={setSearch} />
            </div>
            <p className='small mb-4'>Find all your products!</p>
            <TextField fullWidth label='Search...' onChange={(e) => handleSearch(e.target.value)} InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MdSearch />
                </InputAdornment>
              ),
            }} />
          </div>
        </div>
        <hr className='my-5' />
        <div style={{ minHeight: '100vh' }}>
          {!loading ?
            <table className='table table-hover table-stripped text-center'>
              <thead>
                <tr className='small' style={{ fontWeight: 500 }}>
                  <td>IMAGE</td>
                  <td>NAME</td>
                  <td>BRAND</td>
                  <td>DESCRIPTION</td>
                  <td>PRICE</td>
                  <td>RATING</td>
                  <td>STOCK</td>
                  <td>DISCOUNT</td>
                  <td>ACTIONS</td>
                </tr>
              </thead>
              <tbody>
                {products && products.map((item, index) => {
                  const description = handleSize(item.description)
                  const title = handleSize(item.title)
                  return (
                    <tr key={index} className='lead'>
                      <td><Images thumb={item.thumbnail} images={item.images} /></td>
                      <td>{title.tooltip ? <Tooltip placement='top' arrow title={item.name}><p>{title.value}</p></Tooltip> : title.value}</td>
                      <td>{item.brand}</td>
                      <td>{description.tooltip ?
                        <Tooltip placement='top' arrow title={item.description}>
                          <p style={{ cursor: 'pointer' }}>{description.value}</p>
                        </Tooltip> : description.value
                      }
                      </td>
                      <td style={{ whiteSpace: 'nowrap' }}>{moneyMask(item.price)}</td>
                      <td>
                        <div className="d-flex">
                          <Rating className='me-2' name="read-only" value={item.rating} precision={0.1} readOnly />

                          <Tooltip placement='top' arrow title={item.rating}>
                            <IconButton sx={{ padding: 0 }}><MdInfo /></IconButton>
                          </Tooltip>
                        </div>
                      </td>
                      <td>{item.stock} Un</td>
                      <td>{item.discountPercentage}%</td>
                      <td style={{ whiteSpace: 'nowrap' }}>
                        <IconButton color='inherited' disabled><MdVisibility /></IconButton>
                        <IconButton color='primary' onClick={() => renderToast({ type: 'success', message: `${item.title} successfully edited!` })}><MdEdit /></IconButton>
                        <IconButton color='error' onClick={() => renderAlert({ name: item.title })}><MdDelete /></IconButton>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table> : <div className='d-flex justify-content-center p-5'><CircularProgress /></div>}
        </div>

        {pagination.totalItems &&
          <div className='d-flex justify-content-end'>
            <Pagination color='primary' shape="rounded" count={Math.ceil(pagination.totalItems / pagination.perPage)}
              page={pagination.pageNumber + 1} onChange={(e, page) => {
                window.scrollTo(0, 0); setPagination({ ...pagination, pageNumber: page - 1 }); setAllow(true)
              }
              } />
          </div>
        }
        <ToastContent />
      </div>
    </div >
  );
}

export default App;
