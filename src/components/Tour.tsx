import { Button, Tour, type TourProps } from 'antd'

interface TourButtonProps extends TourProps {
  onButtonClick?: () => void
}

const TourButton: React.FC<TourButtonProps> = (props) => {
  return (
    <div>
      <Button style={{ marginBottom: '8px', marginTop: '8px' }} onClick={props.onButtonClick}>点我显示保姆级使用教程</Button>
      <Tour {...props} />
    </div>
  )
}

export default TourButton
