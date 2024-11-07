import { useEffect, useState } from 'react'
import useTermsAndConditions from '../../Hooks/useTermsAndConditions'
import BackdropLoader from '../reUsableCmponent/BackdropLoader'
import RichTextEditor from '../RichTextEditor/RichTextEditor'

const TermsAndConditions = () => {
  const {
    termsAndConditions,
    loading,
    deleteTermsAndConditions,
    createTermsAndConditions,
    updateTermsAndConditions,
  } = useTermsAndConditions()

  const [data, setData] = useState(termsAndConditions?.data)

  useEffect(() => {
    setData(termsAndConditions?.data)
  }, [termsAndConditions])

  const handleCreate = async (createData) => {
    await createTermsAndConditions({ data: createData })
  }

  const handleUpdate = async (updateData) => {
    await updateTermsAndConditions({ data: updateData })
  }

  return (
    <div>
      <RichTextEditor
        data={data}
        handleCreate={handleCreate}
        setData={setData}
        handleUpdate={handleUpdate}
        loading={loading}
      />
    </div>
  )
}

export default TermsAndConditions
