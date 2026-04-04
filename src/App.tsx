import { ConfigProvider, Layout, Typography } from 'antd'

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
        <Layout.Content style={{ display: 'grid', placeItems: 'center' }}>
          <Typography.Title level={2}>Order Management Dashboard</Typography.Title>
        </Layout.Content>
      </Layout>
    </ConfigProvider>
  )
}

export default App
