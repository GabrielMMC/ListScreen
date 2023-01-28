import React from 'react'
import { BsFilter } from 'react-icons/bs'
import { MdClose, MdSearch } from 'react-icons/md';
import { Box, Fade, IconButton, Modal } from '@mui/material'

const Filter = (props) => {
  const [open, setOpen] = React.useState(false)

  function renderOptions() {
    if (props.options) {
      return props.options.map(item => (
        <div className="form-check my-2 mx-3 d-flex align-items-center">
          <input className="form-check-input" type="checkbox" name="exampleRadios" id={item.id} value={item.value}
            onChange={() => handleChange(item.id)} checked={item.value} />
          <label className="form-check-label lead ms-1" htmlFor={item.id}>
            {item.label}
          </label>
        </div>
      )
      )
    }
  }

  const handleChange = (id) => {
    props.setOptions(state => state.map((item) => {
      if (item.id === id) return { ...item, value: !item.value }; else return { ...item, value: false }
    }))
  }

  const handleOpen = () => {
    props.setAllow(false); setOpen(true)
  }

  const handleClose = () => {
    props.setAllow(true); setOpen(false); props.setSearch(''); props.setPagination({ ...props.pagination, pageNumber: 0 })
  }

  const style = {
    position: 'absolute',
    height: '100%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 2,
  };

  return (
    <div className='ms-2'>
      <IconButton sx={{ padding: 0 }} onClick={(e) => handleOpen(e)}>
        <BsFilter size={30} />
      </IconButton>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
      >
        <Fade in={open}>
          <Box sx={style}>
            <div className="d-flex">
              <IconButton onClick={() => setOpen(false)}>
                <MdClose />
              </IconButton>

              <div className="ms-auto">
                <button className='rounded-button hvr-grow' onClick={handleClose}>
                  <MdSearch size={22} />
                </button>
              </div>
            </div>
            {props.options &&
              < div className="my-4 m-auto">
                {renderOptions()}
              </div>}
          </Box>
        </Fade>
      </Modal>
    </div >
  )
}

export default Filter