// Shown wherever a photo has not been uploaded yet: the Coat of Arms of Kenya.
export default function Placeholder({ label = 'Photo to be added' }) {
  return (
    <div className="ph" role="img" aria-label={label}>
      <img src="/brand/kenya-coat-of-arms.png" alt="" loading="lazy" />
    </div>
  )
}
