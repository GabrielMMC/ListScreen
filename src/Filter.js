import React from 'react'
import { Box, Fade, IconButton, Modal, Tooltip, Typography, Zoom } from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { BsCalendarXFill, BsFilter } from 'react-icons/bs'
import { MdClose, MdInfo, MdSearch } from 'react-icons/md';

const Filter = (props) => {
  const [valueOf, setValueOf] = React.useState('');
  const [valueFor, setValueFor] = React.useState('');
  const [open, setOpen] = React.useState(false)
  const [screenX, setScreenX] = React.useState(0)
  const [screenY, setScreenY] = React.useState(0)
  const [margin, setMargin] = React.useState(0)
  const [rerender, setRerender] = React.useState(0)
  const modalRef = React.useRef()

  React.useEffect(() => {
    if (open && props.options) {
      if (modalRef.current !== undefined && modalRef.current !== null) setMargin(modalRef.current.clientHeight)
      else { setRerender((item) => item + 1); }
    }
  }, [open, rerender, props])

  function renderOptions() {
    if (props.options) {
      let keys = Object.keys({ ...props.options })
      return keys.map(item => (
        <>
          {!props.options[item].disabled &&
            <div className="form-check my-1">
              <input className="form-check-input" type="checkbox" name="exampleRadios" id={item} value={props.options[item]?.checked} onChange={() => handleChange(item)} checked={props.options[item]?.checked} />
              <label className="form-check-label" htmlFor={item}>
                {props.options[item].label}
              </label>
            </div>}
        </>
      )
      )
    }
  }

  function handleChange(item) {
    let newOptions = { ...props.options }
    let keys = Object.keys({ ...props.options })

    keys.forEach(item2 => {
      if (item === item2) newOptions[item2].checked = true;
      else newOptions[item2].checked = false
    })
    props.setOptions(newOptions)
  }

  const handleDateChange = (value, type) => {
    let month; let day

    if (Array.from(String(value.$M)).length === 1) month = '0' + value.$M
    if (value.$M === 9) month = 10
    else month = value.$M + 1

    if (Array.from(String(value.$D)).length === 1) day = '0' + value.$D
    else day = value.$D


    const date = value.$y + '-' + month + '-' + day
    if (type === 'Of') {
      setValueOf(value); setValueFor('')
      if (props.classComponent) props.setState({ dateOf: date, dateFor: '' })
      else { props.setDateOf(date); props.setDateFor('') }

    } else {
      setValueFor(value)
      props.classComponent ? props.setState({ dateFor: date }) : props.setDateFor(date)
    }
  }

  const handleOpen = (e) => {
    setOpen(true)
    setScreenX(e.screenX)
    setScreenY(e.screenY)
    props.classComponent ? props.setState({ reload: false }) : props.setSearch(false)
  }

  const handleClose = () => {
    if (props.options) {
      let newOptions = { ...props.options }
      let keys = Object.keys({ ...props.options })

      keys.forEach(item2 => {
        if (newOptions[item2].checked) newOptions[item2].value = true;
        else newOptions[item2].value = false
      })

      props.setOptions(newOptions)
    }
    props.classComponent ? props.setState({ reload: true }) : props.setSearch(true)
    setOpen(false)
  }

  const resetDate = (type) => {
    if (type === 'All') {
      if (props.classComponent) props.setState({ dateOf: '', dateFor: '' })
      else { props.setDateOf(''); props.setDateFor('') }
      setValueOf(''); setValueFor('')
    }
    if (type === 'Of') { props.classComponent ? props.setState({ dateOf: '' }) : props.setDateOf(''); setValueOf('') }
    else { props.classComponent ? props.setState({ dateFor: '' }) : props.setDateFor(''); setValueFor('') }
  }


  const style = {
    position: 'absolute',
    top: screenY + (margin === 0 ? 0 : (margin < 100 ? 45 : (margin * .50))),
    left: `${screenX}px`,
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    flexDirection: 'column',
    bgcolor: 'background.paper',
    border: '2px solid transparent',
    boxShadow: 24,
    p: 2,
    borderRadius: '.4rem',
    minWidth: '270px'
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
                <Tooltip TransitionComponent={Zoom} title="Clique para excluir datas do filtro" arrow placement="top">
                  <IconButton onClick={() => resetDate('All')}><BsCalendarXFill size={20} /></IconButton>
                </Tooltip>

                <Tooltip TransitionComponent={Zoom} title="Clique na data selecionada para retirá-la do filtro" arrow placement="top">
                  <IconButton><MdInfo /></IconButton>
                </Tooltip>

                <button className='rounded-button hvr-grow' onClick={handleClose}>
                  <MdSearch size={22} />
                </button>
              </div>
            </div>
            {props.options &&
              <div ref={modalRef} className="my-4 m-auto">
                {renderOptions()}
              </div>}
            <div className={`${props.classComponent && 'mt-3'} row`}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <div className="col-6">
                  <div className="d-flex justify-content-center align-items-center">
                    <Typography>De: </Typography>
                    <DatePicker value={valueOf} onChange={(value) => handleDateChange(value, 'Of')} renderInput={({ inputRef, InputProps }) => (
                      <div ref={inputRef} style={{ height: 0 }}>{InputProps?.endAdornment}</div>)} />
                  </div>
                  {valueOf ?
                    <b onClick={() => resetDate('Of')} className='date'>{valueOf.$D}/{valueOf.$M + 1}/{valueOf.$y}</b> :
                    <b className='date'>- / - / -</b>}
                </div>
                <div className="col-6">
                  <div className="d-flex justify-content-center align-items-center">
                    <Typography>Até: </Typography>
                    <DatePicker value={valueFor} onChange={(value) => handleDateChange(value, 'For')} minDate={valueOf && new Date(valueOf)} renderInput={({ inputRef, InputProps }) => (
                      <div ref={inputRef} style={{ height: 0 }}>{InputProps?.endAdornment}</div>)} />
                  </div>
                  {valueFor ?
                    <b onClick={() => resetDate()} className='date'>{valueFor.$D}/{valueFor.$M + 1}/{valueFor.$y}</b> :
                    <b className='date'>- / - / -</b>}
                </div>
              </LocalizationProvider>
            </div>
          </Box>
        </Fade>
      </Modal>
    </div >
  )
}

export default Filter