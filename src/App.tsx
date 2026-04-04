import { ConfigProvider, Layout, Typography } from 'antd'
import { OrdersPage } from './pages/orders-page/ui/OrdersPage'

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#379DF1',
          fontFamily: 'Manrope, Segoe UI, sans-serif',
        },
      }}
    >
      <Layout style={{ minHeight: '100vh', placeItems: 'center' }}>
        <Layout.Header style={{ paddingInline: 24 }}>
          <Typography.Title level={3} style={{ margin: 0, lineHeight: '64px' }}>
            Order Management Dashboard
          </Typography.Title>
        </Layout.Header>
        <Layout.Content style={{ padding: 20 }}>
          <OrdersPage />
        </Layout.Content>
      </Layout>
    </ConfigProvider>
  )
}

export default App
